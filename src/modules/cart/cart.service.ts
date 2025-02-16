import { Injectable } from '@nestjs/common';

import { constrainedMemory } from 'process';
import { PrismaService } from '../prisma/prisma.service';
import { AddFoodDto } from './dto/add_food.dto';
import { TUser } from 'src/common/types/types';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addItem(addFood: AddFoodDto, user: TUser) {
    const newItem = await this.prisma.cart_items.create({
      data: {
        quantity: addFood.quantity,
        branch_food_id: addFood.branch_food_id,
        user_id: user.id,
      },
    });

    return newItem;
  }

  async getCartItems(user: TUser) {
    const items = await this.prisma.cart_items.findMany({
      where: {
        user_id: 1,
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

    const cartItems = items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.branch_foods.price,
      branchFoodId: item.branch_food_id,
      foodName: item.branch_foods.foods.name,
      foodImage: item.branch_foods.foods.image,
      foodDescription: item.branch_foods.foods.description,
      branchId: item.branch_foods.branch_id,
      branchAddress: item.branch_foods.branches.address,
      brandId: item.branch_foods.branches.brand_id,
      brandName: item.branch_foods.branches.brands.name,
    }));

    return cartItems;
  }
}
