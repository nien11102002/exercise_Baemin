import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TUser } from 'types/types';

@Controller()
export class AppController {
  constructor(
    private prisma: PrismaService,
    @Inject('SHIPPING_NAME') private shippingService: ClientProxy,
    @Inject('CART_NAME') private cartService: ClientProxy,
    @Inject('PRODUCT_NAME') private productService: ClientProxy,
  ) {}

  @MessagePattern('create-order')
  async createOrder(@Payload() data) {
    const createOrderDto: CreateOrderDto = data.createOrderDto;
    const user: TUser = data.user;

    const { orderItems, total_price, branch_id, address, shipping_fee } =
      createOrderDto;

    const newOrder = await this.prisma.$transaction(async (prisma) => {
      const order = await prisma.orders.create({
        data: {
          user_id: user.id,
          total_price: total_price,
          branch_id: branch_id,
        },
      });

      const formatOrderItems = orderItems.map((item) => {
        return {
          ...item,
          order_id: order.id,
        };
      });

      await prisma.order_items.createMany({
        data: formatOrderItems,
      });

      return order;
    });

    await Promise.all([
      this.cartService.emit('delete-cart-items', {
        createOrderDto,
        user,
        newOrder,
      }),
      this.productService.emit('reduce-stock', {
        createOrderDto,
        user,
        newOrder,
      }),
      this.shippingService.emit('create-shipping', {
        createOrderDto,
        user,
        newOrder,
      }),
    ]);

    return newOrder;
  }
}
