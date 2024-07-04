import { body } from 'express-validator';
import { getMessage } from '../util/util';

function patientValidations() {
  return [
    body('name')
      .exists()
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'patient.name.requiredField');
      })
      .isLength({ max: 100 })
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'patient.name.maxLength');
      }),
    body('cpf')
      .exists()
      .withMessage((value, { req, location, path }) => {
        return getMessage(req, 'patient.cpf.requiredField');
      }),
    // body('birthday')
    //   .exists()
    //   .withMessage((value, { req, location, path }) => {
    //     return getMessage(req, 'patient.birthday.requiredField');
    //   }),
  ];
}

export { patientValidations };
