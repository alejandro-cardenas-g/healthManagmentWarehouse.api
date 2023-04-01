import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { loadCorsStrategy } from './config/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: loadCorsStrategy(process.env.ALLOWED_HOST),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );
  app.listen(process.env.PORT, () => {
    logger.log(`Server is listening on port ${process.env.PORT}`);
  });
}
bootstrap();
