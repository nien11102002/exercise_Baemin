import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CART_NAME',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@some-rabbit:5672'],
          queue: 'cart_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
