import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootPassvy() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  await app.listen(process.env.PORT || 4000);
}
void bootPassvy();
