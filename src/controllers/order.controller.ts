import { NextFunction, Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { IOrder, IPayment } from '../interfaces/order.interface';
import { RequestWithUser } from '../interfaces/auth.interface';
import { OrderStatus } from '@prisma/client';

export class OrderController {
  private orderService = new OrderService();

  public createOrder = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const userId = request.user.userDocument.id;
      const orderData: IOrder = request.body;
      orderData.userId = userId;
      
      const { data, message } = await this.orderService.createOrder(orderData);
      
      response.status(201).json({ data, message });
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const userId = request.user.userDocument.id;
      const { orderId } = request.params;
      
      const { data, message } = await this.orderService.getOrderById(userId, orderId);
      
      response.status(200).json({ data, message });
    } catch (error) {
      next(error);
    }
  };

  public getUserOrders = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const userId = request.user.userDocument.id;
      
      const { data, message } = await this.orderService.getUserOrders(userId);
      
      response.status(200).json({ data, message });
    } catch (error) {
      next(error);
    }
  };

  public updateOrderStatus = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      // Assuming only staff or admin can update order status
      const { orderId } = request.params;
      const { status } = request.body;
      
      const { data, message } = await this.orderService.updateOrderStatus(orderId, status as OrderStatus);
      
      response.status(200).json({ data, message });
    } catch (error) {
      next(error);
    }
  };

  public initiatePayment = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const paymentData: IPayment = request.body;
      
      const { data, message } = await this.orderService.initiatePayment(paymentData);
      
      response.status(200).json({ data, message });
    } catch (error) {
      next(error);
    }
  };

  public verifyPayment = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { paymentId, orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = request.body;
      
      const { data, message } = await this.orderService.verifyPayment(
        paymentId,
        orderId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
      );
      
      response.status(200).json({ data, message });
    } catch (error) {
      next(error);
    }
  };

  public cashOnDelivery = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const { orderId } = request.body;
      
      const { data, message } = await this.orderService.cashOnDelivery(orderId);
      
      response.status(200).json({ data, message });
    } catch (error) {
      next(error);
    }
  };
}
