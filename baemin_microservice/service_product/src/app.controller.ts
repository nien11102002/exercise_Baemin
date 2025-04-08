import { BadRequestException, Controller, Get, Inject } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TUser } from 'types/types';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller()
export class AppController {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private elasticService: ElasticsearchService,
  ) {}

  @EventPattern('reduce-stock')
  async reduceStock(
    @Payload() data: { createOrderDto: CreateOrderDto; user: TUser },
  ) {
    const { createOrderDto } = data;
    const { orderItems } = createOrderDto;

    const updatePromises = orderItems.map((item) =>
      this.prisma.branch_foods.update({
        where: { id: item.branch_food_id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      }),
    );

    await Promise.all(updatePromises);
  }

  @MessagePattern('get-banners')
  async getBanners() {
    return this.prisma.banners.findMany();
  }

  @MessagePattern('get-foods-pagination')
  async getFoodsPagination(@Payload() data) {
    const page = +data.page;
    const pageSize = +data.pageSize;

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

  @MessagePattern('get-food-types')
  async getFoodTypes() {
    return this.prisma.food_types.findMany();
  }

  @MessagePattern('search-food')
  async searchFood(@Payload() data) {
    const page: number = +data.page;
    const pageSize: number = +data.pageSize;
    const keyword: string = data.keyword;

    const _page = Number.isInteger(page) && page > 0 ? page : 1;
    const _pageSize =
      Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10;
    const skip = (_page - 1) * _pageSize;

    const cacheKey = `foods_pagination?page=${_page}&size=${_pageSize}&keyword=${keyword}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const result = await this.elasticService.search({
        index: 'product-baemin-index',
        from: skip,
        size: _pageSize,
        query: {
          match: {
            food_name: keyword,
          },
        },
      });

      const totalHits = result.hits.total;

      const totalItem =
        typeof totalHits === 'number' ? totalHits : totalHits?.value || 0;
      const totalPage = Math.ceil(totalItem / _pageSize);

      const items = result.hits.hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source,
      }));

      const finalResult = {
        page: _page,
        pageSize: _pageSize,
        totalItem,
        totalPage,
        items,
      };

      this.cacheManager.set(cacheKey, finalResult, 60);
      return finalResult;
    } catch (error) {
      if (error.meta && error.meta.statusCode === 404) {
        return { message: 'Document not found' };
      }
      throw error;
    }
  }

  @MessagePattern('get-branch-food')
  async getBranchFood(@Payload() data) {
    const branch_id: number = +data.branch_id;

    if (!branch_id) throw new BadRequestException('Invalid branch ID');

    const branchFoods = await this.prisma.branch_foods.findMany({
      where: { branch_id: branch_id },
      include: { foods: true },
    });

    if (!branchFoods) throw new BadRequestException('Branch food not found');
    return branchFoods;
  }
}
