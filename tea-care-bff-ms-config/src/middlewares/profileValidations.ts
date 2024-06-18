import { body } from 'express-validator';
import { getMessage } from '../util/util';

function profileValidations() {
  return [
    body('name')
      .exists()
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'profile.name.requiredField');
      })
      .isLength({ max: 100 })
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'profile.name.maxLength');
      }),
    body('symbol')
      .exists()
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'profile.symbol.requiredField');
      })
      .isLength({ max: 100 })
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'profile.symbol.maxLength');
      }),
  ];
}

export { profileValidations };
