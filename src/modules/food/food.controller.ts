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
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

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

  @Get(`get-food-detail:id`)
  getFoodDetail(@Param(`id`) id: string) {
    return this.foodService.getFoodDetail(+id);
  }
}
