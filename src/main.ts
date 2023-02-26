import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Wikimedia name search')
    .setDescription('API for getting short descriptions of people from Wikipedia by name.')
    .setVersion('1.0')
    .build();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(app, config
    , {
      include: [AppModule]
    });

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT;
  await app.listen(port, () => {
    Logger.log(`Started service running on port ${port}`);
  });
}
bootstrap();
