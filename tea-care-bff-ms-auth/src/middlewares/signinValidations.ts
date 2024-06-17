import { body } from 'express-validator';
import { getMessage } from '../util/util';

function signinValidations() {
  return [
    body('email')
      .exists()
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'user.email.requiredField');
      }),
    body('password')
      .exists()
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'user.password.requiredField');
      }),
  ];
}

export { signinValidations };
