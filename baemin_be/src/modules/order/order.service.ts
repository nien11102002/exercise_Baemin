import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TUser } from 'src/common/types/types';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, user: TUser) {
    console.log({ createOrderDto });
    const { orderItems, total_price, branch_id, address, shipping_fee } =
      createOrderDto;
    return this.prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.orders.create({
        data: {
          user_id: user.id,
          total_price: total_price,
          branch_id: branch_id,
        },
      });

      const formatOrderItems = orderItems.map((item) => {
        return {
          ...item,
          order_id: newOrder.id,
        };
      });

      await prisma.order_items.createMany({
        data: formatOrderItems,
      });

      await prisma.cart_items.deleteMany({
        where: {
          user_id: user.id,
          branch_food_id: { in: orderItems.map((item) => item.branch_food_id) },
        },
      });

      await prisma.shippings.create({
        data: {
          address,
          order_id: newOrder.id,
          user_id: user.id,
          shipping_fee,
        },
      });

      await this.reduceStock(orderItems);

      return newOrder;
    });
  }

  private async reduceStock(orderItems: any[]) {
    const updatePromises = orderItems.map((item) => {
      return this.prisma.branch_foods.update({
        where: { id: item.branch_food_id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    });

    await Promise.all(updatePromises);
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
