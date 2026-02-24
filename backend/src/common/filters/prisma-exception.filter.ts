// filepath: backend/src/common/filters/prisma-exception.filter.ts

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response, Request } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let message: string;

    switch (exception.code) {
      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        message = 'A record with that value already exists';
        break;
      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        message = 'The requested record does not exist';
        break;
      case 'P2003':
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Related record not found';
        break;
      case 'P2000':
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Provided value is too long for this field';
        break;
      case 'P2016':
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Query interpretation error';
        break;
      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'An unexpected database error occurred';
        break;
    }

    this.logger.error(
      `Prisma Error [${exception.code}]: ${exception.message}`,
      exception.stack,
    );

    response.status(statusCode).json({
      statusCode,
      message,
      errorCode: exception.code,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
