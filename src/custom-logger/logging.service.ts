import { Injectable, Logger } from '@nestjs/common';
import { LogLevel, LogLevelType } from '../types/types';
import { join } from 'node:path';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);
  private readonly logLevel: string;
  private readonly logDirPath: string;
  private readonly logFilePath: string;
  private readonly logFileName: string;
  private readonly maxLogFileSize: number;

  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'LOG';
    this.logDirPath = join(__dirname, '..', 'logs');
    this.logFileName = 'app.log';
    this.logFilePath = join(this.logDirPath, this.logFileName);
    this.maxLogFileSize = (Number(process.env.LOG_FILE_MAX_SIZE) || 20) * 1024; // 1kB = 1024 bytes

    this.isLogsDirExist();
    this.checkLogFileSize();

    process.on('uncaughtException', (err) => {
      if (this.isLogLevel('ERROR')) {
        const errMessage =
          'Uncaught exception: ' +
          (err instanceof Error ? err.message : JSON.stringify(err));
        this.logError(errMessage);
        err instanceof Error &&
          this.debugError(`${os.EOL} Error stack: ${err.stack}`);
      }
    });

    process.on('unhandledRejection', (err) => {
      if (this.isLogLevel('ERROR')) {
        const errMessage =
          'Unhandled rejection: ' +
          (err instanceof Error ? err.message : JSON.stringify(err));
        this.logError(errMessage);
        err instanceof Error &&
          this.debugError(`${os.EOL} Error stack: ${err.stack}`);
      }
    });
  }

  logRequest(url: string, query: unknown, body: unknown, method: string) {
    if (this.isLogLevel('LOG')) {
      this.logger.log(`Request URL: ${url}, method: ${method}`);
      this.logger.log(
        `${os.EOL} Query params: ${JSON.stringify(query, null, 2)}`,
      );
      this.logger.log(`${os.EOL} Body: ${JSON.stringify(body, null, 2)}`);

      this.appendLog(`Request URL: ${url}, method: ${method}`);
      this.appendLog(`Query params: ${JSON.stringify(query)}`);
      this.appendLog(`Body: ${JSON.stringify(body)}`);
    }
  }

  logResponse(statusCode: number) {
    if (this.isLogLevel('LOG')) {
      this.logger.log(`Response status code: ${statusCode}`);
      this.appendLog(`Response status code: ${statusCode}`);
    }
  }

  logError(err: unknown) {
    if (this.isLogLevel('ERROR')) {
      const errMessage =
        err instanceof Error ? `Error: ${err.message}` : JSON.stringify(err);
      this.logger.error(errMessage, err instanceof Error && err.stack);
      this.appendLog(errMessage);
    }
  }

  debugRequest(headers: Headers, hostname: string) {
    if (this.isLogLevel('DEBUG')) {
      const message = `${os.EOL} headers: ${JSON.stringify(headers, null, 2)},${
        os.EOL
      } hostname: ${hostname}`;

      this.logger.debug(message);
      this.appendLog(message);
    }
  }

  debugResponse(message: string) {
    if (this.isLogLevel('DEBUG')) {
      this.logger.debug(message);
      this.appendLog(message);
    }
  }

  debugError(message: string) {
    if (this.isLogLevel('DEBUG')) {
      this.logger.debug(message);
      this.appendLog(message);
    }
  }

  private isLogLevel(level: LogLevelType) {
    return LogLevel[level] >= LogLevel[this.logLevel];
  }

  private async checkLogFileSize() {
    try {
      const stats = await fs.stat(this.logFilePath);
      if (stats.size > this.maxLogFileSize) {
        await this.rotateLogFile();
      }
    } catch (err) {
      this.logError(err);
    }
  }

  private async rotateLogFile() {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const newFileName = `app-${timestamp}.log`;
    const newFilePath = join(this.logDirPath, newFileName);

    await fs.rename(this.logFilePath, newFilePath);
    await fs.writeFile(this.logFilePath, '', { flag: 'wx+' });
  }

  private async appendLog(message: string) {
    const logMessage = `${new Date().toISOString()} - ${message}${os.EOL}`;
    try {
      await fs.appendFile(this.logFilePath, logMessage);
      await this.checkLogFileSize();
    } catch (err) {
      this.logError(err);
    }
  }

  private async isLogsDirExist() {
    try {
      await fs.mkdir(this.logDirPath, { recursive: true });
      await this.createLogFileIfNotExists();
    } catch (err) {
      this.logError(err);
    }
  }

  private async createLogFileIfNotExists() {
    await this.isLogsDirExist();

    try {
      await fs.access(this.logFilePath);
      this.logError('File app.log already exists');
    } catch (err) {
      await fs.writeFile(this.logFilePath, '', { flag: 'wx' });
    }
  }
}
