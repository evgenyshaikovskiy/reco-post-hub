import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(join(__dirname, '..', 'cert/key.pem')),
    cert: readFileSync(join(__dirname, '..', 'cert/cert.pem')),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.enableCors({ origin: true });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT);
}

bootstrap();
