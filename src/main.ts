import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Wikimedia name search')
    .setDescription("This API provides a way to get short descriptions of people from Wikipedia by name. It allows users to search for a person's name and get their corresponding short description if it is available on English Wikipedia. If the person is not found, the API will return a not found error message. If there are similar names, the API will suggest them to the user. This is a JSON API and all responses will be in JSON format.")
    .setVersion('1.0')
    .setContact(
      'Alvin Kiptoo Chirchir', 
      'https://github.com/alvinchirchir', 
      'alvinchirchir1@gmail.com'
    )
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
