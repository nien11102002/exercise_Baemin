import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
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
      {
        name: 'SHIPPING_NAME',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@some-rabbit:5672'],
          queue: 'shipping_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
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
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
