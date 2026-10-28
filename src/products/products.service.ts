import { Injectable } from '@nestjs/common';

export interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
}

@Injectable()
export class ProductsService {
  // মেমোরিতে মক প্রোডাক্ট ডেটা (ডাটাবেস টেবিলের বিকল্প)
  private products: Product[] = [
    { id: 'p1', name: 'Wireless Mouse', stock: 15, price: 750 },
    { id: 'p2', name: 'Mechanical Keyboard', stock: 5, price: 3200 },
    { id: 'p3', name: 'Gaming Headset', stock: 0, price: 2500 }
  ];

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  decreaseStock(id: string, quantity: number): boolean {
    const product = this.findOne(id);
    if (!product || product.stock < quantity) return false;
    product.stock -= quantity;
    return true;
  }
}
