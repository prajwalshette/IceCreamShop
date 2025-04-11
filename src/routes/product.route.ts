import { ProductController } from '../controllers/product.controller';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import asyncHandler from '../utils/asyncHandler';

export class ProductRoute implements Routes {
	public path = '/product';
	public router = Router();
	public productController = new ProductController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}/create`, asyncHandler(AuthMiddleware), asyncHandler(this.productController.createProduct));
		this.router.put(`${this.path}/update`, asyncHandler(AuthMiddleware), asyncHandler(this.productController.updateProduct));
		this.router.get(`${this.path}/all`, asyncHandler(AuthMiddleware), asyncHandler(this.productController.getAllProducts));
		this.router.get(`${this.path}`, asyncHandler(AuthMiddleware), asyncHandler(this.productController.getProductById));
		this.router.get(`${this.path}/category`, asyncHandler(AuthMiddleware), asyncHandler(this.productController.getProductsByCategory));
		this.router.put(`${this.path}/delete`, asyncHandler(AuthMiddleware), asyncHandler(this.productController.deleteProduct));
		this.router.get(`${this.path}/search`, asyncHandler(AuthMiddleware), asyncHandler(this.productController.searchProduct));
	}
}
