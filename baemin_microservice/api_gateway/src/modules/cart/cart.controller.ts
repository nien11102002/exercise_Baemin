import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { TUser } from 'src/common/types/types';
import { ClientProxy } from '@nestjs/microservices';
import { AddFoodDto } from './dto/add_food.dto';
import { lastValueFrom } from 'rxjs';

@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(@Inject('CART_NAME') private cartService: ClientProxy) {}

  @Post('add-item')
  async addItem(@Body() addFood: AddFoodDto, @User() user: TUser) {
    let newCartItems = await lastValueFrom(
      this.cartService.send('add-item', { addFood, user }),
    );

    return newCartItems;
  }

  @Get(`get-cart-items`)
  async getCartItems(@User() user: TUser) {
    const cartItems = await lastValueFrom(
      this.cartService.send('get-cart-items', { user }),
    );

    return cartItems;
  }

  @Delete(`:id`)
  async removeCartItem(@Param('id') id: string, @User() user: TUser) {
    const result = await lastValueFrom(
      this.cartService.send('remove-cart-item', { id, user }),
    );

    return result;
  }
}
