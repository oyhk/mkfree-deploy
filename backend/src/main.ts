import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtService } from '@nestjs/jwt';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AuthFilter } from './auth.filter';
import { AuthGuard } from './auth.guard';
import { ApiFilter } from './api.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['debug', 'log', 'error', 'warn', 'verbose'],
  });

  app.useGlobalGuards(new AuthGuard(app.get(JwtService)));
  // AuthFilter 用户登录认证、权限检查
  // ApiFilter api请求过程中异常处理
  app.useGlobalFilters(new AuthFilter(), new ApiFilter());

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
