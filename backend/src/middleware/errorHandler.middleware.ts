import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import snakecaseKeys from 'snakecase-keys';

import codes from '../utils/codes';


import { getErrorMessage } from '../errors/messages.errors';

interface ErrorHandler {
  code: number;
  status: number;
  message: string;
  details: string;
}
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.code;
  let { message } = err;
  let details;
  const code = statusCode || codes.INTERNAL_SERVER_ERROR;
  switch (code) {
    case codes.BAD_REQUEST:
      message = message || 'Bad Request';
      details = err.details;
      break;
    case codes.UNAUTHORIZED:
      message = 'Unauthorized';
      break;
    case codes.FORBIDDEN:
      message = 'Forbidden';
      break;
    case codes.NOT_FOUND:
      message = 'Not Found';
      break;
    case codes.TOO_MANY_REQUESTS:
      message = 'Too many requests';
      break;
    case codes.INTERNAL_SERVER_ERROR:
      statusCode = codes.INTERNAL_SERVER_ERROR;
      message = message || 'Something went wrong';
      break;
    default:
      message = message || getErrorMessage(code);
      statusCode = 200;
  }
  return res.status(statusCode).send(
    snakecaseKeys(
      {
        status: 0,
        code,
        message,
        details,
      },
      { deep: true },
    ),
  );
};

