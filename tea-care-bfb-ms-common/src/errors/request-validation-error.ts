import { ValidationError } from 'express-validator';

import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      switch (err.type) {
        case 'field':
          return {
            message: err.msg,
            field: JSON.stringify({
              value: err.value,
              path: err.path,
              type: err.type,
              location: err.location,
            }),
          };

        case 'alternative':
        case 'alternative_grouped':
          return {
            message: err.msg,
            field: JSON.stringify({
              type: err.type,
              nestedErrors: err.nestedErrors.toString(),
            }),
          };

        case 'unknown_fields':
          return { message: err.msg, field: err.fields.toString() };
      }
    });
  }
}
