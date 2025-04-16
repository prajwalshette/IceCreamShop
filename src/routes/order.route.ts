import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
// import { ValidationMiddleware } from '../middlewares/validation.middleware';
// import { OrderDto, UpdateOrderStatusDto, PaymentDto, VerifyPaymentDto, CashOnDeliveryDto } from '../dtos/order.dto';
// import { RoleMiddleware } from '../middlewares/role.middleware';
// import { Role } from '@prisma/client';
import asyncHandler from '../utils/asyncHandler';

export class OrderRoute {
  public path = '/order';
  public router = Router();
  public orderController = new OrderController();
//   public authMiddleware = new AuthMiddleware();
//   public roleMiddleware = new RoleMiddleware();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, asyncHandler(AuthMiddleware), asyncHandler(this.orderController.createOrder));
    this.router.get(`${this.path}/:orderId`, asyncHandler(AuthMiddleware), asyncHandler(this.orderController.getOrderById));
    this.router.get(`${this.path}`, asyncHandler(AuthMiddleware), asyncHandler(this.orderController.getUserOrders));
    // Update order status (admin/staff only)
    this.router.put(`${this.path}/:orderId/status`, asyncHandler(AuthMiddleware), asyncHandler(this.orderController.updateOrderStatus));
    this.router.post(`${this.path}/payment/initiate`, asyncHandler(AuthMiddleware), asyncHandler(this.orderController.initiatePayment));
    this.router.post(`${this.path}/payment/verify`, asyncHandler(AuthMiddleware), this.orderController.verifyPayment);
    this.router.post(`${this.path}/payment/cash-on-delivery`, asyncHandler(AuthMiddleware), asyncHandler(this.orderController.cashOnDelivery));
    this.router.post(`${this.path}/test`, asyncHandler(AuthMiddleware), asyncHandler(this.orderController.testRazorpayCredentials));
 

}
}