import 'reflect-metadata';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';

import {
  BASE_PATH,
  LOG_FORMAT,
  NODE_ENV,
  PORT,
} from './config';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { logger, stream } from './utils/logger';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
		this.app = express();
		this.env = NODE_ENV || 'development';
		this.port = PORT || 3000;

		this.initializeMiddlewares();
		this.initializeRoutes(routes);
		this.initializeErrorHandling();
	}

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
		this.app.use(morgan(LOG_FORMAT as string, { stream }));
		this.app.use(cors());
		this.app.use(hpp());
		this.app.use(helmet());
		this.app.use(compression());
		this.app.use(
			express.json({
				verify(req: any, res, buf) {
					req.rawBody = buf;
				},
				limit: '1GB',
			}),
		);
		this.app.use(express.urlencoded({ extended: true }));
	}

  private initializeRoutes(routes: Routes[]) {
		const basePath = (BASE_PATH || '/api').trim() || '/';

		routes.forEach(route => {
			this.app.use(basePath, route.router);
		});
	}

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }

}