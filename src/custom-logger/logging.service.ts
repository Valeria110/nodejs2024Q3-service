import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  logRequest(url: string, query: unknown, body: unknown, method: string) {
    this.logger.log(`Request URL: ${url}, method: ${method}`);
    this.logger.log(`Query params: ${JSON.stringify(query)}`);
    this.logger.log(`Body: ${JSON.stringify(body)}`);
  }

  logResponse(statusCode: number) {
    this.logger.log(`Response status code: ${statusCode}`);
  }

  logError(error: any) {
    this.logger.error(`Error: ${error.message}`, error.stack);
  }
}
