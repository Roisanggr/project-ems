import 'module-alias/register';

import path from "path";
import cors from "cors";
import express, { json, urlencoded } from "express";
import createRouter, { router } from "express-file-routing";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import morgan from 'morgan';
import { testConnection } from './utils/db1';

const main = async () => {
  dotenv.config();

  const app = express();

  // Test database connection on startup
  console.log('🔄 Testing database connection...');
  await testConnection();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(fileUpload());
  app.use(morgan('dev')); // Add Morgan middleware
  app.use(express.static(path.join(__dirname, '../public')));

  const router = express.Router();

  let bodyParser = require('body-parser');

  app.use(
    bodyParser.json({
      limit: "50mb",
    })
  );
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
  );

  // Setup API routes
  await createRouter(router, {
    directory: path.join(__dirname, "routes"),
  });

  app.use("/api", router);

  // Setup view routes
  await createRouter(router, {
    directory: path.join(__dirname, "views"),
  });

  app.use("/views", router);

  // Global error handler
  app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error:', error);
    res.status(500).json({
      status: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  });

  // 404 handler
  app.use('*', (req: express.Request, res: express.Response) => {
    res.status(404).json({
      status: false,
      error: `Route ${req.method} ${req.originalUrl} not found`
    });
  });

  const APP_PORT = process.env.APP_PORT || 4999;
  app.listen(APP_PORT, () => {
    console.log(`🚀 IoT Dashboard API Server started on port ${APP_PORT}`);
    console.log(`📊 Dashboard: http://localhost:${APP_PORT}/api/dashboard`);
    console.log(`🔧 IoT Endpoints: http://localhost:${APP_PORT}/api/iot/*`);
  });
};

main().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
