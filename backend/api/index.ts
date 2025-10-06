import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express, { Request, Response } from 'express';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

const expressApp = express();
let isAppInitialized = false;
let nestApp: any;

const createNestApp = async () => {
  if (!isAppInitialized) {
    // Add graphql-upload middleware
    expressApp.use(
      graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    );

    const adapter = new ExpressAdapter(expressApp);
    nestApp = await NestFactory.create(AppModule, adapter);

    nestApp.enableCors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
    });

    await nestApp.init();
    isAppInitialized = true;
  }
  return expressApp;
};

export default async (req: Request, res: Response) => {
  const app = await createNestApp();
  app(req, res);
};
