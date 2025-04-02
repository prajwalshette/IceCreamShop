import { AuthController } from '../controllers/auth.controller';
import { LoginDto, SignUpDto } from '../dtos/auth.dto';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';

export class AuthRoute implements Routes {
	public path = '/';
	public router = Router();
	public authController = new AuthController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}signup`, this.authController.signup);
		this.router.post(`${this.path}login`, this.authController.login);
	}
}
