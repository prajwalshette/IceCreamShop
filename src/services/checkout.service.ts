
import { HttpException } from '../exceptions/HttpException';
import { IOrder } from '../interfaces/order.interface';
import prisma from '../database';

export class CheckoutService {
  private prisma = prisma;

  public async checkout(userId: string, addressId: string, paymentMethod: string): Promise<{ data: any; message: string }> {
    try {
      // Validate address
      const address = await this.prisma.address.findFirst({
        where: { id: addressId, userId, isDeleted: false },
      });
      
      if (!address) {
        throw new HttpException(404, 'Address not found');
      }

      // Get user's cart
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart || cart.cartItems.length === 0) {
        throw new HttpException(400, 'Cart is empty');
      }

      // Calculate order total and prepare order items
      let totalAmount = 0;
      const orderItems = cart.cartItems.map(item => {
        // Validate product availability
        if (!item.product.isAvailable || item.product.isDeleted) {
          throw new HttpException(400, `Product "${item.product.name}" is no longer available`);
        }

        const subtotal = item.product.price * item.quantity;
        totalAmount += subtotal;

        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product.price,
          subtotal,
        };
      });

      // Prepare order data
      const orderData: IOrder = {
        userId,
        addressId,
        totalAmount,
        orderItems,
        paymentMethod: paymentMethod as any,
      };

      return { data: orderData, message: 'Checkout data prepared successfully' };
    } catch (error) {
      throw error;
    }
  }
}