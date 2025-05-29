import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import { config } from './config';

import { GlobalExceptionFilter } from './common/filters';
import { GlobalHttpResponseInterceptor } from './common/interceptors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({
    origin: config().FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalInterceptors(new GlobalHttpResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.setGlobalPrefix('api');

  await app.listen(config().PORT);
}

void bootstrap();
