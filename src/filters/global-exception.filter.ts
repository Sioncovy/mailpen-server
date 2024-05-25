// error.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorCode } from 'src/constants/error-code';
import { CommonError } from 'src/errors/common.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = exception.message;
    let code: ErrorCode | undefined;

    if (exception instanceof CommonError) {
      code = exception.code;
      message = exception.message;
    }

    response.status(200).json({
      code: code || 0,
      message,
    });
  }
}
