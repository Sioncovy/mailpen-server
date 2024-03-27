// error.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ErrorCode } from 'src/constants/error-code';
import { CommonError } from 'src/errors/common.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('✨  ~ GlobalExceptionFilter ~ exception:', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message =
      exception instanceof CommonError
        ? exception.message
        : 'Internal Server Error';
    let code: ErrorCode | undefined;
    console.log('filter', message, code);

    if (exception instanceof CommonError) {
      code = exception.code;
      message = exception.message;
    }

    response.status(200).json({
      code,
      message,
    });
  }
}
