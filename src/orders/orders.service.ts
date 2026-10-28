import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Order, OrderStatus } from './interfaces/order.interface';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private currentId = 1000;

  constructor(private productsService: ProductsService) {}

  findAll(page: number = 1, search: string = '', status: string = '') {
    const limit = 5;
    const searchTerm = search.toLowerCase();

    const filtered = this.orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm) || 
                            order.customerName.toLowerCase().includes(searchTerm);
      const matchesStatus = status ? order.status === status : true;
      return matchesSearch && matchesStatus;
    });

    return {
      data: filtered.slice((page - 1) * limit, page * limit),
      meta: { pageCount: Math.ceil(filtered.length / limit) || 1, totalCount: filtered.length, currentPage: page }
    };
  }

  findOne(id: string): Order {
    const order = this.orders.find(o => o.id === id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  create(dto: CreateOrderDto): Order {
    // ১. লাইভ স্টক ভ্যালিডেশন চেক
    for (const item of dto.items) {
      const product = this.productsService.findOne(item.productId);
      if (!product) throw new BadRequestException(`Product ${item.productId} does not exist`);
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Quantity for ${product.name} exceeds available stock (${product.stock} left)!`);
      }
    }

    // ২. স্টক মাইনাস করা
    dto.items.forEach(item => this.productsService.decreaseStock(item.productId, item.quantity));

    // ৩. অর্ডার অবজেক্ট জেনারেট ও পুশ
    this.currentId++;
    const newOrder: Order = {
      id: String(this.currentId),
      orderNumber: `ORD-${this.currentId}`,
      createdAt: new Date().toISOString(),
      status: 'placed',
      itemsCount: dto.items.length,
      totalAmount: dto.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      ...dto
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateStatus(id: string, action: 'next' | 'cancel', reason?: string): Order {
    const order = this.findOne(id);
    const transitions: Record<OrderStatus, OrderStatus | null> = {
      placed: 'confirmed', confirmed: 'shipped', shipped: 'delivered', delivered: null, cancelled: null
    };

    if (action === 'cancel') {
      if (['delivered', 'cancelled'].includes(order.status)) {
        throw new BadRequestException('This order cannot be cancelled.');
      }
      order.status = 'cancelled';
      order.cancelReason = reason || 'No reason specified';
      return order;
    }

    const nextStatus = transitions[order.status];
    if (!nextStatus) throw new BadRequestException('No further status updates allowed.');

    order.status = nextStatus;
    return order;
  }

  getDashboardStats() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysOrders = this.orders.filter(o => o.createdAt.startsWith(todayStr));
    
    return {
      todaysCount: todaysOrders.length,
      todaysRevenue: todaysOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      recentOrders: this.orders.slice(0, 5)
    };
  }
}
