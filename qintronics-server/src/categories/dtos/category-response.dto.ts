import { Product } from 'src/products/product.entity';
import { CategoryCreateDto } from './category-create.dto';

export class CategoryResponseDto extends CategoryCreateDto {
  id: string;
  products: Product[];
  sectionId: string;
  iconURL: string;
  createdAt: Date;
  updatedAt: Date;
}
