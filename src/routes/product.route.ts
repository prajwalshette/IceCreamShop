import { ProductController } from '../controllers/product.controller';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class ProductRoute implements Routes {
	public path = '/product';
	public router = Router();
	public productController = new ProductController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}/create`, AuthMiddleware, this.productController.createProduct);
		this.router.put(`${this.path}/update`, AuthMiddleware, this.productController.updateProduct);
		this.router.get(`${this.path}/all`, AuthMiddleware, this.productController.getAllProducts);
		this.router.get(`${this.path}`, AuthMiddleware, this.productController.getProductById);
		this.router.get(`${this.path}/category`, AuthMiddleware, this.productController.getProductsByCategory);
		this.router.put(`${this.path}/delete`, AuthMiddleware, this.productController.deleteProduct);
		this.router.get(`${this.path}/search`, AuthMiddleware, this.productController.searchProduct);
	}
}
