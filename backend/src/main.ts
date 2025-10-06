import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Add graphql-upload middleware before CORS
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); // 10MB max
  
  app.enableCors({
    origin: ['http://localhost:3000', process.env.FRONTEND_URL || ''].filter(Boolean),
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
