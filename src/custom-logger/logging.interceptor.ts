import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { url, headers, hostname, query, body, method } = context
      .switchToHttp()
      .getRequest();
    const start = Date.now();
    const res = context.switchToHttp().getResponse();
    this.logger.logRequest(url, query, body, method);
    this.logger.debugRequest(headers, hostname);

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - start;
        this.logger.logResponse(res.statusCode);
        this.logger.debugResponse(`Response time: ${responseTime}ms`);
      }),
      catchError((err) => {
        this.logger.logError(err);
        return throwError(() => err);
      }),
    );
  }
}
