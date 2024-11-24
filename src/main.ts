import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import { LoggingInterceptor } from './custom-logger/logging.interceptor';
import { LoggingService } from './custom-logger/logging.service';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';

const PORT = Number(process.env.PORT) || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const docFileYaml = await readFile(
    join(__dirname, '..', 'doc', 'api.yaml'),
    'utf-8',
  );
  SwaggerModule.setup('doc', app, parse(docFileYaml));
  console.log('dirname: ', __dirname);

  app.useGlobalPipes(new ValidationPipe());
  const logger = new LoggingService();
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  await app.listen(PORT);
}
bootstrap();
