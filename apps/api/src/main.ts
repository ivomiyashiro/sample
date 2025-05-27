import { NestFactory } from '@nestjs/core';
import { config } from './core/config';
import { GlobalExceptionFilter } from './core/filters';
import { HttpGlobalInterceptor } from './core/interceptors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new HttpGlobalInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(config().PORT);
}

void bootstrap();
