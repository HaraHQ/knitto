import { body, param } from 'express-validator';

export const validateEditProfile = [
  param('id').notEmpty().withMessage('Invalid user Id'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('age').optional().isInt({ min: 1 }).withMessage('Age must be an integer'),
  body('pp').optional().isURL().withMessage('Profile picture must be a URL'),
];