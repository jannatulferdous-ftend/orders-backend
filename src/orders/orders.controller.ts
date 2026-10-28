import { Controller, Get, Post, Patch, Body, Query, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders(@Query('page') page?: string, @Query('search') search?: string, @Query('status') status?: string) {
    return this.ordersService.findAll(Number(page) || 1, search, status);
  }

  @Get('dashboard-stats')
  getDashboardStats() {
    return this.ordersService.getDashboardStats();
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { action: 'next' | 'cancel'; reason?: string }) {
    return this.ordersService.updateStatus(id, body.action, body.reason);
  }
}

