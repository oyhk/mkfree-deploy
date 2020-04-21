import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RemindInterceptor } from './RemindInterceptor';
import { LogLevel } from '@nestjs/common/services/logger.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'log', 'error', 'warn', 'verbose'],
  });
  // app.useGlobalInterceptors(new RemindInterceptor());
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: '*',
    maxAge: 3600,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  });
  await app.listen(5000);
}

bootstrap();