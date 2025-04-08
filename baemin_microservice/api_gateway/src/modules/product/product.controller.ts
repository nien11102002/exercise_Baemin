import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { ApiQuery } from '@nestjs/swagger';
import { last, lastValueFrom, retry } from 'rxjs';

@Public()
@Controller('food')
export class ProductController {
  constructor(@Inject('PRODUCT_NAME') private productService: ClientProxy) {}

  @Get('get-banners')
  async getBanners() {
    const banners = await lastValueFrom(
      this.productService.send('get-banners', {}),
    );

    return banners;
  }

  @Get('get-foods-pagination')
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of items per page',
  })
  async getFoodsPagination(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const foods = await lastValueFrom(
      this.productService.send('get-foods-pagination', { page, pageSize }),
    );
    return foods;
  }

  @Get('get-food-types')
  async getFoodTypes() {
    const foodTypes = await lastValueFrom(
      this.productService.send('get-food-types', {}),
    );

    return foodTypes;
  }

  @Get('search-food')
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description: 'Keyword to search',
  })
  async searchFood(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('keyword') keyword?: string,
  ) {
    const searchedFoods = await lastValueFrom(
      this.productService
        .send('search-food', { page, pageSize, keyword })
        .pipe(retry(2)),
    );

    return searchedFoods;
  }

  @Get(`get-branch-food/:branch_id`)
  async getBranchFood(@Param(`branch_id`) branch_id: string) {
    const branchFoods = await lastValueFrom(
      this.productService.send('get-branch-food', { branch_id }),
    );

    return branchFoods;
  }
}
