import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { QueryTypes } from 'sequelize';
import { validationResult } from 'express-validator';
import axios from 'axios';

import sequelize from './db';
import { generateJwt } from './helper';

import User from './model/user.model';
import Profile from './model/profile.model';

type Ok = {
  ok?: boolean;
  data?: any;
  error?: any;
  token?: string;
  message?: string;
}

export const ok = (req: Request, res: Response) => {
  const response: Ok = { ok: true };
  res.json(response)
};
export const users = async (req: Request, res: Response) => {
  let response: Ok;
  try {
    const data = await User.findAll({
      attributes: ['id', 'email']
    });

    response = { ok: true, data };
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.json(response)
};
export const getFromAPI = async (req: Request, res: Response) => {
  let response: Ok;
  try {
    const data = await axios.get('https://dummyjson.com/products/1');
    response = { ok: true, data: data.data };
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.json(response)
};
export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({ message: 'File uploaded successfully' });
};
export const sequelizeByQuery = async (req: Request, res: Response) => {
  let response: Ok;
  try {
    const querying = await sequelize.query('SELECT p.fullName as fullName, u.email as email FROM profile p INNER JOIN `user` u ON p.user_id = u.id;', {
      type: QueryTypes.SELECT
    });
    response = { ok: true, data: querying };
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.json(response)
};

// crud user
export const addUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, fullName, age, pp } = req.body;

    const trx = await sequelize.transaction();
    const user = await User.create({ email, password: bcrypt.hashSync(password, 10)! }, { transaction: trx, returning: true });
    await Profile.create({ fullName, age, pp, userId: user.dataValues.id! }, { transaction: trx });

    await trx.commit();

    res.status(201).json({ ok: true, message: 'User created successfully' });
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const getUser = async (req: Request, res: Response) => {
  try {
    const data = await User.findOne({
      attributes: ['id', 'email'],
      where: {
        id: req.params.id
      }
    });
    return res.json({ ok: true, data });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const edtUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    await User.update({
      password: bcrypt.hashSync(req.body.password, 10),
    }, {
      where: {
        id: req.params.id
      }
    });
    return res.json({ ok: true, message: 'Password updated' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const delUser = async (req: Request, res: Response) => {
  try {
    const trx = await sequelize.transaction();

    await User.destroy({
      where: {
        id: req.params.id
      },
      transaction: trx
    });
    await Profile.destroy({
      where: {
        userId: req.params.id
      },
      transaction: trx
    });

    await trx.commit();

    return res.json({ ok: true, message: 'User deleted' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// crud profile, gak perlu di add dan delete, karena sudah transaction di addUser
export const getProfile = async (req: Request, res: Response) => {
  try {
    const data = await Profile.findOne({
      attributes: ['id', 'fullName', 'age', 'pp'],
      where: {
        userId: req.params.id
      }
    });
    res.json({ ok: true, data });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
export const edtProfile = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const data = await Profile.update({
      fullName: req.body.fullName,
      pp: req.body.pp,
      age: req.body.age,
    }, {
      where: {
        userId: req.params.id
      }
    });
    res.json({ ok: true, data });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.json({ ok: true })
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let response: Ok;
  try {
    const data = await User.findOne({
      attributes: ['id', 'email', 'password'],
      where: {
        email
      }
    });

    // compare password
    if (!bcrypt.compareSync(password, data?.dataValues.password!)) {
      return res.status(401).json({ error: 'Wrong password or email not found' });
    }

    response = { ok: true, token: generateJwt({ id: data?.dataValues.id, email: data?.dataValues.email }) };
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.json(response)
}