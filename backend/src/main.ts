import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthInterceptor } from './auth-interceptor';
import { JwtService } from '@nestjs/jwt';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['debug', 'log', 'error', 'warn', 'verbose'],
  });
  // 用户登录认证、权限检查
  const jwtService = app.get<JwtService>(JwtService);
  app.useGlobalInterceptors(new AuthInterceptor(jwtService));
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: '*',
    maxAge: 3600,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  });

  app.useStaticAssets('public');
  app.setBaseViewsDir('views');
  app.setViewEngine('hbs');

  await app.listen(5000);

}

bootstrap();
