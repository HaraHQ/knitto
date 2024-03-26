import express, { Express } from 'express';
import multer from 'multer';

import * as r from './routes';
import sequelize from './db';

import { AuthMiddleware } from './middleware/auth.middleware';

import { validateAddUser } from './validate/addUser';
import { validateEditUser } from './validate/editUser';
import { validateEditProfile } from './validate/editProfile';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

export const handleFileUpload = upload.single('file');

const app: Express = express();

app.use(express.json());
const port = 3000;

app.post('/login', r.login);

app.get('/users', r.users)

app.use('/secure', AuthMiddleware)

app.get('/secure/users', r.users)
app.get('/secure/product', r.getFromAPI)
app.get('/secure/join', r.sequelizeByQuery)
app.post('/secure/upload', handleFileUpload, r.uploadFile)

app.post('/secure/crud/user', validateAddUser, r.addUser)
app.get('/secure/crud/user/:id', r.getUser)
app.put('/secure/crud/user/:id', validateEditUser, r.edtUser)
app.delete('/secure/crud/user/:id', r.delUser)

app.get('/secure/crud/profile/:id', r.getProfile)
app.put('/secure/crud/profile/:id', validateEditProfile, r.edtProfile)

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log('Running: M. Rizkiansyah - Knitto Coding Test')
})