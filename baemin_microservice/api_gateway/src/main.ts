import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseSuccessInterceptor } from './common/interceptor/response-success.interceptor';
import { AllExceptionFilter } from './common/filter/all-exception.filter';
import { JwtAuthGuard } from './modules/user/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new ResponseSuccessInterceptor(reflector));
  app.useGlobalFilters(new AllExceptionFilter());
  app.enableCors();

  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
