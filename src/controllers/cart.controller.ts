import { NextFunction, Request, Response } from 'express';
import { CartService } from '../services/cart.service';
import { ICartItem } from '../interfaces/cart.interface';
import { RequestWithUser } from '../interfaces/auth.interface';

export class CartController {
  private cartService = new CartService();

  public addToCart = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const userId = request.user.userDocument.id;
      const cartItemData: ICartItem = request.body;
      
      const { data, message } = await this.cartService.addToCart(userId, cartItemData);
      
      response.status(201).json({ data, message });
    } catch (error) {
      next(error);
    }
  };

  public getCart = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const userId = request.user.userDocument.id;
      
      const { data, message } = await this.cartService.getCart(userId);
      
      response.status(200).json({ data, message });
    } catch (error) {
      next(error);
    }
  };

  public updateCartItem = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const userId = request.user.userDocument.id;
      const { cartItemId } = request.params;
      const { quantity } = request.body;
      
      const { data, message } = await this.cartService.updateCartItem(userId, cartItemId, quantity);
      
      response.status(200).json({ data, message });
    } catch (error) {
      next(error);
    }
  };

  public removeFromCart = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const userId = request.user.userDocument.id;
      const { cartItemId } = request.params;
      
      const { data, message } = await this.cartService.removeFromCart(userId, cartItemId);
      
      response.status(200).json({ data, message });
    } catch (error) {
      next(error);
    }
  };

  public clearCart = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const userId = request.user.userDocument.id;
      
      const { data, message } = await this.cartService.clearCart(userId);
      
      response.status(200).json({ data, message });
    } catch (error) {
      next(error);
    }
  };
}