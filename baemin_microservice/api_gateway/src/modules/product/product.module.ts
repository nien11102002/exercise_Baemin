import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_NAME',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@some-rabbit:5672'],
          queue: 'product_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
