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
    const { url, query, body, method } = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    this.logger.logRequest(url, query, body, method);

    return next.handle().pipe(
      tap(() => {
        this.logger.logResponse(res.statusCode);
      }),
      catchError((err) => {
        this.logger.logError(err);
        return throwError(() => err);
      }),
    );
  }
}
