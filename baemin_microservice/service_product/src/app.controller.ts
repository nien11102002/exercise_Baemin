import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TUser } from 'types/types';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @EventPattern('reduce-stock')
  async reduceStock(
    @Payload() data: { createOrderDto: CreateOrderDto; user: TUser },
  ) {
    const { createOrderDto } = data;
    const { orderItems } = createOrderDto;

    const updatePromises = orderItems.map((item) =>
      this.prisma.branch_foods.update({
        where: { id: item.branch_food_id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      }),
    );

    await Promise.all(updatePromises);
  }
}
