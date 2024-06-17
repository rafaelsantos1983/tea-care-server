import { body } from 'express-validator';
import { getMessage } from '../util/util';

function signupValidations() {
  return [
    body('name')
      .exists()
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'user.name.requiredField');
      })
      .isLength({ max: 100 })
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'user.name.maxLength');
      }),
    body('email')
      .exists()
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'user.email.requiredField');
      })
      .isLength({ max: 100 })
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'user.email.maxLength');
      }),
    body('password')
      .exists()
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'user.password.requiredField');
      })
      .isLength({ max: 100 })
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'user.password.maxLength');
      }),
    body('confirmPassword')
      .exists()
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'user.confirmPassword.requiredField');
      })
      .isLength({ max: 100 })
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'user.confirmPassword.maxLength');
      }),
  ];
}

export { signupValidations };
