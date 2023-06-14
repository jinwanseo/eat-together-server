import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import startSwagger from './swagger';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  // Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  startSwagger(app);
  app.enableCors();

  await app.listen(8888);
}

bootstrap();
