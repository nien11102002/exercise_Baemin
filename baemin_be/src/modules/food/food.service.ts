import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FoodService {
  constructor(private prisma: PrismaService) {}

  async getBanners() {
    const banners = await this.prisma.banners.findMany({});
    return banners;
  }

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
      select: {
        id: true,
        name: true,
        food_types: true,
        image: true,
        branch_foods: {
          include: {
            branches: true,
          },
        },
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

    console.log({ keyword });

    const skip = (page - 1) * pageSize;
    const totalItemResult = await this.prisma.$queryRaw`
    SELECT COUNT(*) 
    FROM foods 
    WHERE unaccent(name) ILIKE unaccent(${`%${keyword}%`});
  `;

    const totalItem = Number(totalItemResult[0]?.count || 0);
    const totalPage = Math.ceil(totalItem / pageSize);

    const result = await this.prisma.$queryRaw`
    SELECT * 
    FROM foods 
    WHERE unaccent(name) ILIKE unaccent(${`%${keyword}%`}) 
    ORDER BY id ASC 
    LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize};
  `;

    console.log({ result });

    return {
      page: page,
      pageSize: pageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: result || [],
    };
  }

  async getFoodDetail(id: number) {
    if (id === 0 || !id) throw new BadRequestException('Wrong id!!!');
    const food_types = await this.prisma.foods.findFirst({
      where: { id: id },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        type_id: true,
        food_types: { select: { name: true } },
        branch_foods: {
          select: {
            branches: {
              select: { address: true, brands: { select: { name: true } } },
            },
          },
        },
      },
    });
    return food_types;
  }
}
