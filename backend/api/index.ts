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
    console.log('Initializing NestJS app for Vercel...');
    
    // graphql-upload middleware
    expressApp.use(
      graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    );

    const adapter = new ExpressAdapter(expressApp);
    nestApp = await NestFactory.create(AppModule, adapter, {
      logger: ['error', 'warn', 'log'],
    });

    nestApp.enableCors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight'],
    });

    await nestApp.init();
    isAppInitialized = true;
    console.log('NestJS app initialized successfully');
  }
  return expressApp;
};

export default async (req: Request, res: Response) => {
  try {
    const app = await createNestApp();
    app(req, res);
  } catch (error) {
    console.error('Error initializing app:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};
