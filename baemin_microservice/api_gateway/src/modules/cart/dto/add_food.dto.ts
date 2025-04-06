import { ApiProperty } from '@nestjs/swagger';

export class AddFoodDto {
  @ApiProperty()
  branch_food_id: number;

  @ApiProperty()
  quantity: number;
}
