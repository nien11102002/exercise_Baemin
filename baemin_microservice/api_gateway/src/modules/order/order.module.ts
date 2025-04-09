import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDER_NAME',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@some-rabbit:5672'],
          queue: 'order_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
})
export class OrderModule {}
