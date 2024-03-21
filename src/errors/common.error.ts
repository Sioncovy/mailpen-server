import { ErrorCode } from '../constants/error-code';

export class CommonError extends Error {
  code: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string) {
    super(message);
    this.code = errorCode;
  }
}
