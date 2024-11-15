import { Injectable, Logger } from '@nestjs/common';
import { LogLevel, LogLevelType } from '../types/types';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);
  private readonly logLevel: string;

  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'LOG';

    process.on('uncaughtException', (err) => {
      if (this.isLogLevel('ERROR')) {
        const errMessage =
          'Uncaught exception: ' +
          (err instanceof Error ? err.message : JSON.stringify(err));
        this.logError(errMessage);
      }
    });

    process.on('unhandledRejection', (err) => {
      if (this.isLogLevel('ERROR')) {
        const errMessage =
          'Unhandled rejection: ' +
          (err instanceof Error ? err.message : JSON.stringify(err));
        this.logError(errMessage);
      }
    });
  }

  logRequest(url: string, query: unknown, body: unknown, method: string) {
    if (this.isLogLevel('LOG')) {
      this.logger.log(`Request URL: ${url}, method: ${method}`);
      this.logger.log(`\n Query params: ${JSON.stringify(query, null, 2)}`);
      this.logger.log(`\n Body: ${JSON.stringify(body, null, 2)}`);
    }
  }

  logResponse(statusCode: number) {
    if (this.isLogLevel('LOG')) {
      this.logger.log(`Response status code: ${statusCode}`);
    }
  }

  logError(error: any) {
    if (this.isLogLevel('ERROR')) {
      this.logger.error(`Error: ${error.message}`, error.stack);
    }
  }

  debugRequest(headers: Headers, hostname: string) {
    if (this.isLogLevel('DEBUG')) {
      this.logger.debug(
        `\n headers: ${JSON.stringify(
          headers,
          null,
          2,
        )},\n hostname: ${hostname}`,
      );
    }
  }

  debugResponse(message: string) {
    if (this.isLogLevel('DEBUG')) {
      this.logger.debug(message);
    }
  }

  isLogLevel(level: LogLevelType) {
    return LogLevel[level] >= LogLevel[this.logLevel];
  }
}
