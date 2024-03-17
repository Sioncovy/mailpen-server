import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 允许跨域
  app.enableCors();
  // 全局使用验证管道
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(1122);
}
bootstrap();
