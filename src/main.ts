import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS এনাবল করা হচ্ছে যাতে Next.js ফ্রন্টএন্ড থেকে এই ব্যাকএন্ড এপিআই কল করা যায়
  app.enableCors();
  
  // গ্লোবাল ভ্যালিডেশন পাইপ হিসেবে Zod যুক্ত করা হলো
  app.useGlobalPipes(new ZodValidationPipe());

  await app.listen(4000); // ব্যাকএন্ড পোর্ট ৪০০০ এ রান হবে
  console.log(`🚀 Backend is running on: http://localhost:4000`);
}
bootstrap();
