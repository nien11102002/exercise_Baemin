import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('get-banners')
  getBanners() {
    return this.foodService.getBanners();
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
  getFoodsPagination(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.foodService.getFoodsPagination(+page, +pageSize);
  }

  @Get('get-food-types')
  getFoodTypes() {
    return this.foodService.getFoodTypes();
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
  searchFood(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.foodService.searchFood(+page, +pageSize, keyword);
  }

  @Get(`get-branch-food/:branch_id`)
  getBranchFood(@Param(`branch_id`) branch_id: string) {
    return this.foodService.getBranchFood(+branch_id);
  }
}
