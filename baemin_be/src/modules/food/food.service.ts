import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FoodService {
  constructor(private prisma: PrismaService) {}

  async getBanners() {
    return this.prisma.banners.findMany();
  }

  async getFoodsPagination(page: number, pageSize: number) {
    const _page = Number.isInteger(page) && page > 0 ? page : 1;
    const _pageSize =
      Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10;
    const skip = (_page - 1) * _pageSize;
    console.log({ _page, _pageSize });
    const totalItem = await this.prisma.branch_foods.count();
    const totalPage = Math.ceil(totalItem / _pageSize);

    const foods = await this.prisma.branch_foods.findMany({
      skip,
      take: _pageSize,
      orderBy: { id: 'asc' },
      include: {
        foods: {
          select: {
            id: true,
            name: true,
            image: true,
            food_types: { select: { name: true } },
          },
        },
        branches: {
          select: {
            id: true,
            address: true,
            brands: { select: { name: true } },
          },
        },
      },
    });

    return {
      page: _page,
      pageSize: _pageSize,
      totalItem,
      totalPage,
      items: foods || [],
    };
  }

  async getFoodTypes() {
    return this.prisma.food_types.findMany();
  }

  async searchFood(page: number, pageSize: number, keyword: string) {
    const _page = Number.isInteger(page) && page > 0 ? page : 1;
    const _pageSize =
      Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10;
    const skip = (_page - 1) * _pageSize;

    const totalItemResult = await this.prisma.$queryRaw`
      SELECT COUNT(*) AS count
      FROM branch_foods bf
      JOIN foods f ON bf.food_id = f.id
      WHERE unaccent(f.name) ILIKE unaccent(${`%${keyword}%`})
    `;
    const totalItem = Number(totalItemResult[0]?.count || 0);
    const totalPage = Math.ceil(totalItem / _pageSize);

    const result = await this.prisma.$queryRaw`
      SELECT 
        bf.id AS branch_food_id,
        f.id AS food_id,
        f.name AS food_name,
        f.image AS food_image,
        ft.name AS food_type_name,
        b.id AS branch_id,
        b.address AS branch_address,
        br.name AS brand_name
      FROM branch_foods bf
      JOIN foods f ON bf.food_id = f.id
      LEFT JOIN food_types ft ON f.type_id = ft.id
      JOIN branches b ON bf.branch_id = b.id
      JOIN brands br ON b.brand_id = br.id
      WHERE unaccent(f.name) ILIKE unaccent(${`%${keyword}%`})
      ORDER BY bf.id ASC
      LIMIT ${_pageSize} OFFSET ${skip}
    `;

    return {
      page: _page,
      pageSize: _pageSize,
      totalItem,
      totalPage,
      items: result || [],
    };
  }

  async getBranchFood(branch_id: number) {
    if (!branch_id) throw new BadRequestException('Invalid branch ID');

    const branchFoods = await this.prisma.branch_foods.findMany({
      where: { branch_id: branch_id },
      include: { foods: true },
    });
    // await this.prisma.branches.findFirst({
    //   where: { id: branch_id },
    //   select: {
    //
    //   },
    // });

    if (!branchFoods) throw new BadRequestException('Branch food not found');
    return branchFoods;
  }
}
