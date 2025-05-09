import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TUser } from 'types/types';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @EventPattern('create-shipping')
  async createShipping(@Payload() data) {
    const createOrderDto: CreateOrderDto = data.createOrderDto;
    const user: TUser = data.user;
    const newOrder = data.newOrder;

    const { address, shipping_fee } = createOrderDto;

    await this.prisma.shippings.create({
      data: {
        address,
        order_id: newOrder.id,
        user_id: user.id,
        shipping_fee,
      },
    });
  }
}
