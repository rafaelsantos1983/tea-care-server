import { body } from 'express-validator';
import { getMessage } from '../util/util';

function recoverPasswordValidations() {
  return [
    body('email')
      .exists()
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'user.email.requiredField');
      }),
  ];
}

export { recoverPasswordValidations };
