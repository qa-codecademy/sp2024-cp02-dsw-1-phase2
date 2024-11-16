import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { DeepPartial, FindOptionsWhere, ILike, Repository } from 'typeorm';
import * as categoriesData from '../data/categories.json';
import * as productsData from '../data/products.json';
import { Category } from './category.entity';
import { CategoryCreateDto } from './dtos/category-create.dto';
import { CategoryQueryDto } from './dtos/category-query.dto';
import { CategoryResponseDto } from './dtos/category-response.dto';
import { CategoryUpdateDto } from './dtos/category-update.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getCategories({
    name,
  }: CategoryQueryDto): Promise<CategoryResponseDto[]> {
    let whereQuery = {} satisfies FindOptionsWhere<Category>;

    if (name) {
      whereQuery = {
        ...whereQuery,
        name: ILike(name),
      };
    }

    return this.categoryRepository.find({
      where: whereQuery,
    });
  }

  async getCategoryById(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found!');
    return category;
  }

  async createCategory(body: CategoryCreateDto): Promise<CategoryResponseDto> {
    const newCategory = this.categoryRepository.create(body);
    return this.categoryRepository.save(newCategory);
  }

  async updateCategory(
    id: string,
    body: CategoryUpdateDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) throw new NotFoundException('Category not found!');

    const updatedCategory = this.categoryRepository.merge(category, body);
    return this.categoryRepository.save(updatedCategory);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.productRepository.delete({ categoryId: id });
    await this.categoryRepository.delete({ id });
  }
}
