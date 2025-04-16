import { PrismaClient, OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { HttpException } from '../exceptions/HttpException';
import { IOrder, IPayment } from '../interfaces/order.interface';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Service } from 'typedi';
import { RAZORPAY_KEY_SECRET, RAZORPAY_KEY_ID } from '../config/index'

@Service()
export class OrderService {
  private prisma = new PrismaClient();
  private razorpay: Razorpay;
  
  constructor() {
    this.razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }

  public async createOrder(orderData: IOrder): Promise<{ data: any; message: string }> {
    try {
      const address = await this.prisma.address.findFirst({
        where: { id: orderData.addressId, userId: orderData.userId, isDeleted: false },
      });
      
      if (!address) {
        throw new HttpException(404, 'Address not found');
      }

      const order = await this.prisma.order.create({
        data: {
          totalAmount: orderData.totalAmount,
          userId: orderData.userId,
          addressId: orderData.addressId,
          paymentMethod: orderData.paymentMethod as PaymentMethod,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.UNPAID,
          orderItems: {
            create: orderData.orderItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          address: true,
        },
      });

      const cart = await this.prisma.cart.findUnique({
        where: { userId: orderData.userId },
      });
      
      if (cart) {
        await this.prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }

      return { data: order, message: 'Order created successfully' };
    } catch (error) {
      throw error;
    }
  }

  public async getOrderById(userId: string, orderId: string): Promise<{ data: any; message: string }> {
    try {
      const order = await this.prisma.order.findFirst({
        where: { id: orderId, userId, isDeleted: false },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          address: true,
          payment: true,
        },
      });

      if (!order) {
        throw new HttpException(404, 'Order not found');
      }

      return { data: order, message: 'Order fetched successfully' };
    } catch (error) {
      throw error;
    }
  }

  public async getUserOrders(userId: string): Promise<{ data: any; message: string }> {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId, isDeleted: false },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
          payment: {
            select: {
              id: true,
              amount: true,
              status: true,
              method: true,
              razorpayOrderId: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      return { data: orders, message: 'Orders fetched successfully' };
    } catch (error) {
      throw error;
    }
  }

  public async updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ data: any; message: string }> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId, isDeleted: false },
      });

      if (!order) {
        throw new HttpException(404, 'Order not found');
      }

      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: {
          orderItems: true,
          address: true,
          payment: true,
        },
      });

      return { data: updatedOrder, message: 'Order status updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  public async initiatePayment(paymentData: IPayment): Promise<{ data: any; message: string }> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: paymentData.orderId, isDeleted: false },
      });

      if (!order) {
        throw new HttpException(404, 'Order not found');
      }

      const existingPayment = await this.prisma.payment.findFirst({
        where: { orderId: paymentData.orderId, status: PaymentStatus.PAID },
      });

      if (existingPayment) {
        throw new HttpException(400, 'Payment already completed for this order');
      }

      // Create Razorpay order
      const razorpayOrder = await this.razorpay.orders.create({
        amount: Math.round(paymentData.amount * 100),
        currency: paymentData.currency || 'INR',
        receipt: `rcpt_${paymentData.orderId.slice(0, 30)}`,
        payment_capture: true,
      });

      // Create payment record in database
      const payment = await this.prisma.payment.create({
        data: {
          orderId: paymentData.orderId,
          amount: paymentData.amount,
          method: paymentData.method as PaymentMethod,
          currency: paymentData.currency || 'INR',
          razorpayOrderId: razorpayOrder.id,
          status: PaymentStatus.UNPAID,
        },
      });

      // Update order payment status
      await this.prisma.order.update({
        where: { id: paymentData.orderId },
        data: { paymentStatus: PaymentStatus.UNPAID },
      });

      return {
        data: {
          payment,
          razorpayOrder: {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
          },
        },
        message: 'Payment initiated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  public async verifyPayment(paymentId: string, orderId: string, razorpayPaymentId: string, razorpayOrderId: string, razorpaySignature: string): Promise<{ data: any; message: string }> {
    try {

      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET || '')
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        throw new HttpException(400, 'Invalid payment signature');
      }

      // Update payment record
      const payment = await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          razorpayPaymentId,
          razorpaySignature,
          status: PaymentStatus.PAID,
        },
      });

      // Update order payment status
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.PROCESSING,
        },
      });

      return { data: payment, message: 'Payment verified successfully' };
    } catch (error) {
      await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          razorpayPaymentId,
          razorpaySignature,
          status: PaymentStatus.FAILED,
        },
      });
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.FAILED,
          status: OrderStatus.PROCESSING,
        },
      });

      throw error;
    }
  }

  public async cashOnDelivery(orderId: string): Promise<{ data: any; message: string }> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId, isDeleted: false },
      });

      if (!order) {
        throw new HttpException(404, 'Order not found');
      }

      if (order.paymentMethod !== PaymentMethod.CASH) {
        throw new HttpException(400, 'Payment method is not cash on delivery');
      }
      
      const payment = await this.prisma.payment.create({
        data: {
          orderId,
          amount: order.totalAmount,
          method: PaymentMethod.CASH,
          status: PaymentStatus.UNPAID,
        },
      });

      // Update order status
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PROCESSING,
        },
      });

      return { data: payment, message: 'Cash on delivery order confirmed' };
    } catch (error) {
      throw error;
    }
  };

  public async testRazorpayCredentials(): Promise<any> {
    try {
      const order = await this.razorpay.orders.create({
        amount: 500, // ₹5 in paise
        currency: 'INR',
        receipt: `test_receipt_${Date.now()}`,
        payment_capture: true,
      });
  
      console.log("✅ Razorpay test order created successfully:", order);
      return order;
    } catch (error) {
      console.error("❌ Razorpay API key is invalid or order creation failed:", error);
      throw error;
    }
  }
  
}