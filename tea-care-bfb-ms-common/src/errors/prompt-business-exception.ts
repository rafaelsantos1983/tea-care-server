import { CustomError } from './custom-error';

export class TeaCareBusinessException extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, TeaCareBusinessException.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
