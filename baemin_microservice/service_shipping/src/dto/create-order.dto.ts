type orderItem = {
  branch_food_id: number;
  quantity: number;
  price: number;
};

export class CreateOrderDto {
  orderItems: orderItem[];

  total_price: number;

  branch_id: number;

  address: string;

  shipping_fee: number;
}
