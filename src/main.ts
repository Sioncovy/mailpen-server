import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptions/transform.interception';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 允许跨域
  app.enableCors();
  // 全局使用验证管道
  app.useGlobalPipes(new ValidationPipe());
  // 全局使用响应拦截
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局使用异常过滤器
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 启动服务
  await app.listen(1122);
}
bootstrap();
