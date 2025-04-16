import { HttpException } from '../exceptions/HttpException';
import { ICartItem } from '../interfaces/cart.interface';
import prisma from '../database';

export class CartService {
  private prisma = prisma;

  public async addToCart(userId: string, cartItemData: ICartItem): Promise<{ data: any; message: string }> {
    try {
      // Check if product exists
      const product = await this.prisma.product.findUnique({
        where: { id: cartItemData.productId, isDeleted: false, isAvailable: true },
      });

      if (!product) {
        throw new HttpException(404, 'Product not found or not available');
      }

      // Check if user has a cart, create one if not
      let cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: true },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: {
            userId,
            cartItems: {
              create: {
                productId: cartItemData.productId,
                quantity: cartItemData.quantity,
              },
            },
          },
          include: { cartItems: true },
        });
        return { data: cart, message: 'Cart created and product added' };
      }

      // Check if product already exists in cart
      const existingCartItem = cart.cartItems.find(item => item.productId === cartItemData.productId);

      if (existingCartItem) {
        // Update quantity if product already exists
        const updatedCartItem = await this.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + cartItemData.quantity },
        });
        return { data: updatedCartItem, message: 'Cart item quantity updated' };
      } else {
        // Add new product to cart
        const newCartItem = await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: cartItemData.productId,
            quantity: cartItemData.quantity,
          },
        });
        return { data: newCartItem, message: 'Product added to cart' };
      }
    } catch (error) {
      throw error;
    }
  }

  public async getCart(userId: string): Promise<{ data: any; message: string }> {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          cartItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imageUrl: true,
                  isAvailable: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        return { data: { userId, cartItems: [] }, message: 'Cart is empty' };
      }

      return { data: cart, message: 'Cart fetched successfully' };
    } catch (error) {
      throw error;
    }
  }

  public async updateCartItem(userId: string, cartItemId: string, quantity: number): Promise<{ data: any; message: string }> {
    try {
      // Check if cart exists
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: true },
      });

      if (!cart) {
        throw new HttpException(404, 'Cart not found');
      }

      // Check if cart item exists and belongs to user's cart
      const cartItem = cart.cartItems.find(item => item.id === cartItemId);
      if (!cartItem) {
        throw new HttpException(404, 'Cart item not found');
      }

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        await this.prisma.cartItem.delete({
          where: { id: cartItemId },
        });
        return { data: null, message: 'Cart item removed' };
      } else {
        // Update quantity
        const updatedCartItem = await this.prisma.cartItem.update({
          where: { id: cartItemId },
          data: { quantity },
        });
        return { data: updatedCartItem, message: 'Cart item updated' };
      }
    } catch (error) {
      throw error;
    }
  }

  public async removeFromCart(userId: string, cartItemId: string): Promise<{ data: any; message: string }> {
    try {
      // Check if cart exists
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: true },
      });

      if (!cart) {
        throw new HttpException(404, 'Cart not found');
      }

      // Check if cart item exists and belongs to user's cart
      const cartItem = cart.cartItems.find(item => item.id === cartItemId);
      if (!cartItem) {
        throw new HttpException(404, 'Cart item not found');
      }

      // Remove cart item
      await this.prisma.cartItem.delete({
        where: { id: cartItemId },
      });

      return { data: null, message: 'Item removed from cart' };
    } catch (error) {
      throw error;
    }
  }

  public async clearCart(userId: string): Promise<{ data: any; message: string }> {
    try {
      // Check if cart exists
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        return { data: null, message: 'Cart is already empty' };
      }

      // Delete all cart items
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return { data: null, message: 'Cart cleared successfully' };
    } catch (error) {
      throw error;
    }
  }
}