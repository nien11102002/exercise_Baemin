import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FoodService {
  constructor(private prisma: PrismaService) {}

  async getFoodsPagination(page: number, pageSize: number) {
    const _page = page > 0 ? page : 1;
    const _pageSize = pageSize > 0 ? pageSize : 10;

    const skip = (_page - 1) * _pageSize;
    const totalItem = await this.prisma.foods.count();
    const totalPage = Math.ceil(totalItem / _pageSize);

    const foods = await this.prisma.foods.findMany({
      skip: skip,
      take: _pageSize,
      orderBy: {
        id: 'asc',
      },
    });

    return {
      page: _page,
      pageSize: _pageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: foods || [],
    };
  }

  async getFoodTypes() {
    const food_types = await this.prisma.food_types.findMany({});
    return food_types;
  }

  async searchFood(page: number, pageSize: number, keyword: string) {
    page = page > 0 ? page : 1;
    pageSize = pageSize > 0 ? pageSize : 10;

    const skip = (page - 1) * pageSize;
    const totalItem = await this.prisma.foods.count({
      where: {
        name: {
          contains: keyword,
        },
      },
    });
    const totalPage = Math.ceil(totalItem / pageSize);
    const result = await this.prisma.foods.findMany({
      skip: skip,
      take: pageSize,
      orderBy: {
        created_at: 'asc',
      },
      where: {
        name: {
          contains: keyword,
        },
      },
    });

    return {
      page: page,
      pageSize: pageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: result || [],
    };
  }
}
