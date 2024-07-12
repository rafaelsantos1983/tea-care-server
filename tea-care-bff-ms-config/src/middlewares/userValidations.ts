import { body } from 'express-validator';
import { getMessage } from '../util/util';

function userValidations() {
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
    body('cpf')
      .exists()
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'user.cpf.requiredField');
      }),
    body('phone')
      .exists()
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'user.phone.requiredField');
      })
      .isLength({ max: 11 })
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'user.phone.maxLength');
      }),
  ];
}

export { userValidations };
