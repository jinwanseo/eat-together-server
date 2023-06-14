import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function startSwagger(app: INestApplication): void {
  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Eat Together')
        .setDescription('Eat Together API Server Document')
        .addBearerAuth()
        .setVersion('1.0.0')
        .build(),
    ),
  );
}

export default startSwagger;
