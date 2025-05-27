import { NestFactory } from '@nestjs/core';
import { config } from './config';
import { GlobalExceptionFilter } from './filters';
import { HttpGlobalInterceptor } from './interceptors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new HttpGlobalInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(config().PORT);
}

void bootstrap();
