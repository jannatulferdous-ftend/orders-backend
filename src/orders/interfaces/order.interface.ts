export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  shippingAddress: string;
  createdAt: string;
  totalAmount: number;
  status: OrderStatus;
  itemsCount: number;
  items: OrderItem[];
  cancelReason?: string;
}
