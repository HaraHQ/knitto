import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve(__dirname, '../.env') });

const secret = process.env.JWT_SECRET;

export const verifyJwt = (token: string) => {
  return jsonwebtoken.verify(token, secret!);
}

export const decodeJwt = (token: string) => {
  return jsonwebtoken.decode(token);
}

export const generateJwt = (payload: object) => {
  return jsonwebtoken.sign(payload, secret!);
}