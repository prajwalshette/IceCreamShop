import { NextFunction, Response } from 'express';
import { CheckoutService } from '../services/checkout.service';
import { RequestWithUser } from '../interfaces/auth.interface';

export class CheckoutController {
  private checkoutService = new CheckoutService();

  public checkout = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const userId = request.user.userDocument.id;
      const { addressId, paymentMethod } = request.body;
      
      const { data, message } = await this.checkoutService.checkout(userId, addressId, paymentMethod);
      
      response.status(200).json({ data, message });
    } catch (error) {
      next(error);
    }
  };
}