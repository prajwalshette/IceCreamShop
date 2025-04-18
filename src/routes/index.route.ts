import { IndexController } from '../controllers/index.controller';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';

export class IndexRoute implements Routes {
	public path = '/';
	public router = Router();
	public indexController = new IndexController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, this.indexController.index);
		this.router.get(`/health`, this.indexController.healthCheck);
	}
}
