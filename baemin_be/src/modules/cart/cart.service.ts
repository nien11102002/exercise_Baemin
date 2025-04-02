import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as _ from 'lodash';
import { PrismaService } from '../prisma/prisma.service';
import { AddFoodDto } from './dto/add_food.dto';
import { TUser } from 'src/common/types/types';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addItem(addFood: AddFoodDto, user: TUser) {
    const existedItem = await this.prisma.cart_items.findFirst({
      where: {
        user_id: user.id,
        branch_food_id: addFood.branch_food_id,
      },
    });

    if (existedItem) {
      return await this.prisma.cart_items.update({
        where: { id: existedItem.id },
        data: { quantity: existedItem.quantity + addFood.quantity },
      });
    } else {
      return await this.prisma.cart_items.create({
        data: {
          quantity: addFood.quantity,
          branch_food_id: addFood.branch_food_id,
          user_id: user.id,
        },
      });
    }
  }

  async getCartItems(user: TUser) {
    const items = await this.prisma.cart_items.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        branch_foods: {
          include: {
            foods: true,
            branches: { include: { brands: true } },
          },
        },
      },
    });

    const groupedItems = _.groupBy(
      items,
      (item) => item.branch_foods.branch_id,
    );

    return Object.entries(groupedItems).map(([branchId, items]) => ({
      name: items[0].branch_foods.branches.brands.name,
      branchId: items[0].branch_foods.branch_id,
      branchAddress: items[0].branch_foods.branches.address,
      brandId: items[0].branch_foods.branches.brands.id,
      quandoitac: true,
      items: items.map((item) => ({
        id: item.id,
        branchFoodId: item.branch_food_id,
        foodName: item.branch_foods.foods.name,
        img: item.branch_foods.foods.image,
        unitPrice: item.branch_foods.price,
        quantity: item.quantity,
        totalPrice: Number(item.branch_foods.price) * item.quantity,
      })),
    }));
  }

  async removeCartItem(cart_item_id: number, user: TUser) {
    const cartItem = await this.prisma.cart_items.findUnique({
      where: { id: cart_item_id },
      select: { user_id: true },
    });

    if (!cartItem) {
      throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
    }

    if (cartItem.user_id !== user.id) {
      throw new ForbiddenException(
        'Forbidden: You can only remove your own cart items.',
      );
    }

    await this.prisma.cart_items.delete({
      where: { id: cart_item_id },
    });

    return { message: `Successfully removed cart item #${cart_item_id}` };
  }
}
