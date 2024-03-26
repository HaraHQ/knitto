import { body, param } from 'express-validator';

export const validateEditUser = [
  param('id').notEmpty().withMessage('Invalid user Id'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('password_confirm').isLength({ min: 6 }).notEmpty().custom((value, { req }) => {
    // cek pass nya sama gak
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];