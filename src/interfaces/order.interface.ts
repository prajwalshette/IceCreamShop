export interface IOrderItem {
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }
  
  export interface IOrder {
    userId: string;
    addressId: string;
    totalAmount: number;
    orderItems: IOrderItem[];
    paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI';
  }
  
  export interface IPayment {
    orderId: string;
    amount: number;
    method: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI';
    currency?: string;
  }
  