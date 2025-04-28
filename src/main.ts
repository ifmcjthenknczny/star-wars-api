import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { QueryFailedFilter } from './common/filters/query-failed.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Star Wars API')
    .setDescription('Star Wars API recruitment task documentation')
    .setVersion('0.0.1')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'x-api-key')
    .build();

  const swagger = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swagger);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new QueryFailedFilter());

  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
