import { body } from 'express-validator';

export const validateAddUser = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a positive integer'),
  body('pp').notEmpty().withMessage('Profile picture is required'),
];