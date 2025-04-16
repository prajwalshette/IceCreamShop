import { ReviewController } from '../controllers/review.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler';

export class ReviewRoute implements Routes {
	public path = '/review';
	public router = Router();
	public reviewController = new ReviewController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}/create`, asyncHandler(AuthMiddleware), asyncHandler(this.reviewController.createReview));
        this.router.put(`${this.path}/update`, asyncHandler(AuthMiddleware), asyncHandler(this.reviewController.updateReview));
        this.router.get(`${this.path}/product`, asyncHandler(AuthMiddleware), asyncHandler(this.reviewController.getProductReview));
        this.router.delete(`${this.path}/delete`, asyncHandler(AuthMiddleware), asyncHandler(this.reviewController.deleteReview));
	}
}
