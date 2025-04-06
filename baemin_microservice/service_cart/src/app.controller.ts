import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TUser } from 'types/types';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @EventPattern('delete-cart-items')
  async deleteCartItems(@Payload() data) {
    const createOrderDto: CreateOrderDto = data.createOrderDto;
    const user: TUser = data.user;

    const { orderItems } = createOrderDto;

    await this.prisma.cart_items.deleteMany({
      where: {
        user_id: user.id,
        branch_food_id: { in: orderItems.map((item) => item.branch_food_id) },
      },
    });
  }
}
