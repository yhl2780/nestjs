import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ReturnInterceptor } from './common/interceptor/return.interceptor';
import { setupSwagger } from './swagger';
import { PrismaService } from './prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  // 전역 범위 파이프
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // validation을 위한 decorator가 붙어있지 않은 속성들은 제거
      forbidNonWhitelisted: true, // whitelist 설정을 켜서 걸러질 속성이 있다면 아예 요청 자체를 막도록 (400 에러)
      transform: true, // 요청에서 넘어온 자료들의 형변환
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  //* Global HttpException Filter
  app.useGlobalFilters(new HttpExceptionFilter());
  //* Global Return Interceptor
  app.useGlobalInterceptors(new ReturnInterceptor());
  // cors
  app.enableCors();

  //run mode 가 local 때에만 swagger ui 셋업
  if (process.env.NODE_ENV !== 'prod') {
    setupSwagger(app);
  }

  // BigInt 이슈
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(3001);
}
bootstrap();
