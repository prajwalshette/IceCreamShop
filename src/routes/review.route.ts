import { ReviewController } from '@/controllers/review.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';

export class ReviewRoute implements Routes {
	public path = '/review';
	public router = Router();
	public reviewController = new ReviewController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}/create`, AuthMiddleware, this.reviewController.createReview);
        this.router.put(`${this.path}/update`, AuthMiddleware, this.reviewController.updateReview);
        this.router.get(`${this.path}/product`, AuthMiddleware, this.reviewController.getProductReview);
        this.router.delete(`${this.path}/delete`, AuthMiddleware, this.reviewController.deleteReview);
	}
}
