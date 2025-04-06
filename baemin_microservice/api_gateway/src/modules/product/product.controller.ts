import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('food')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
}
