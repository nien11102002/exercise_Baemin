import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('food')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
}
