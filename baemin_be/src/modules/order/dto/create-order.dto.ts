import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  total_price: number;
}
