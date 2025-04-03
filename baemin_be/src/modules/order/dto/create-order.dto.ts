import { ApiProperty } from '@nestjs/swagger';

type orderItem = {
  branch_food_id: number;
  quantity: number;
  price: number;
};

export class CreateOrderDto {
  @ApiProperty()
  orderItems: orderItem[];

  @ApiProperty()
  total_price: number;

  @ApiProperty()
  branch_id: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  shipping_fee: number;
}
