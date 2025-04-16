import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import asyncHandler from '../utils/asyncHandler';

export class CartRoute {
  public path = "/cart";
  public router = Router();
  public cartController = new CartController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add`, asyncHandler(AuthMiddleware), asyncHandler(this.cartController.addToCart));
    this.router.get(`${this.path}`, asyncHandler(AuthMiddleware), asyncHandler(this.cartController.getCart));
    this.router.put(`${this.path}/update/:cartItemId`, asyncHandler(AuthMiddleware) ,asyncHandler(this.cartController.updateCartItem));
    this.router.delete(`${this.path}/remove/:cartItemId`, asyncHandler(AuthMiddleware), asyncHandler(this.cartController.removeFromCart));
    this.router.delete( `${this.path}`, asyncHandler(AuthMiddleware), asyncHandler(this.cartController.clearCart));
  }
}
