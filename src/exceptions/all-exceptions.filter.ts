import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { LoggingService } from 'src/custom-logger/logging.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggingService) {}
  catch(exception: any, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest();
    const res = host.switchToHttp().getResponse();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message;

    const errObj = {
      error: status === 500 ? 'Internal Server Error' : exception.name,
      statusCode: status,

      message:
        typeof message === 'string' ? message : message['message'] || message,
    };
    res.status(status).json(errObj);

    this.logger.logError(errObj);
    this.logger.debugError(
      JSON.stringify({
        ...errObj,
        path: req.url,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}
