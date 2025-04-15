import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler';

export class AuthRoute implements Routes {
	public path = '/';
	public router = Router();
	public authController = new AuthController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}signup`,this.authController.signup);
		this.router.post(`${this.path}login`, this.authController.login);
		this.router.put(`${this.path}profile-update`, asyncHandler(AuthMiddleware), asyncHandler(this.authController.updateProfile));
		this.router.post(`${this.path}address-create`, asyncHandler(AuthMiddleware), asyncHandler(this.authController.createAdress));
		this.router.get(`${this.path}address`, asyncHandler(AuthMiddleware), asyncHandler(this.authController.getUserAdress));
	}
}
