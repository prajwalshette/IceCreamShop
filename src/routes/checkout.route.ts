import { Router } from 'express';
import { CheckoutController } from '../controllers/checkout.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
// import { CheckoutDto } from '../dtos/checkout.dto';
import asyncHandler from '@/utils/asyncHandler';

export class CheckoutRoute {
  public path = '/checkout';
  public router = Router();
  public checkoutController = new CheckoutController();
//   public authMiddleware = new AuthMiddleware();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, asyncHandler(AuthMiddleware), asyncHandler(this.checkoutController.checkout));
  }
}