import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';

@Module({
  providers: [ProductsService],
  exports: [ProductsService] // এটি এক্সপোর্ট করায় OrdersModule সরাসরি স্টক চেক করতে পারবে
})
export class ProductsModule {}

