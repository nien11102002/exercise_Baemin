import { Body, Controller, Inject, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/common/decorators/user.decorator';
import { TUser } from 'src/common/types/types';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('order')
export class OrderController {
  constructor(@Inject('ORDER_NAME') private orderService: ClientProxy) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @User() user: TUser) {
    let newOrder = await lastValueFrom(
      this.orderService.send('create-order', { createOrderDto, user }),
    );

    return newOrder;
  }
}
