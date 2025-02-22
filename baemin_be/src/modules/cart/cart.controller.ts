import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddFoodDto } from './dto/add_food.dto';
import { User } from 'src/common/decorators/user.decorator';
import { TUser } from 'src/common/types/types';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-item')
  addItem(@Body() addFood: AddFoodDto, @User() user: TUser) {
    return this.cartService.addItem(addFood, user);
  }

  @Get(`get-cart-items`)
  getCartItems(@User() user: TUser) {
    return this.cartService.getCartItems(user);
  }
}
