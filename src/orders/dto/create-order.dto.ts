import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      name: z.string(),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      price: z.number()
    })
  ).min(1, "At least one item must be added")
});

export class CreateOrderDto extends createZodDto(createOrderSchema) {}
