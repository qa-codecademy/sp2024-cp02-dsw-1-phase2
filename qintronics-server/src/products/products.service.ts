import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, MoreThan, Repository } from 'typeorm';
import { ProductCreateDto } from './dtos/product-create.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { ProductUpdateDto } from './dtos/product-update.dto';
import { ProductQueryDto } from './dtos/product-query.dto';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProducts({
    discount,
    name,
    brand,
    categoryName,
    page = 1,
    pageSize = 10,
    sortBy = 'name',
    sort = 'ASC',
  }: ProductQueryDto): Promise<ProductResponseDto> {
    let whereQuery: FindOptionsWhere<Product> = {};

    if (discount) {
      whereQuery = {
        ...whereQuery,
        discount: MoreThan(0),
      };
    }

    if (name) {
      whereQuery = {
        ...whereQuery,
        name: ILike(`%${name}%`),
      };
    }

    if (brand) {
      whereQuery = {
        ...whereQuery,
        brand: ILike(brand),
      };
    }

    if (categoryName) {
      const category = await this.categoryRepository.findOne({
        where: { name: ILike(categoryName) },
      });

      if (!category) throw new NotFoundException('Category not found!');

      whereQuery = {
        ...whereQuery,
        categoryId: category.id,
      };
    }

    const [products, total] = await this.productRepository.findAndCount({
      where: whereQuery,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        [sortBy]: sort,
      },
    });

    const totalPages = Math.ceil(total / pageSize);

    const payload: ProductResponseDto = {
      products: products,
      total: total,
      next: page < totalPages,
      prev: page > 1,
    };

    return payload;
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found!');
    return product;
  }

  async createProduct(body: ProductCreateDto): Promise<Product> {
    const category = await this.categoryRepository.findOneBy({
      id: body.categoryId,
    });

    if (!category) throw new NotFoundException('Category not found!');

    const newProduct = this.productRepository.create(body);
    return this.productRepository.save(newProduct);
  }

  async updateProduct(id: string, body: ProductUpdateDto): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) throw new NotFoundException('Product not found!');

    const updatedProduct = this.productRepository.merge(product, body);
    return this.productRepository.save(updatedProduct);
  }

  async favoriteProduct(id: string, userId: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['favoritedBy'],
    });

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!product || !user)
      throw new NotFoundException('Product or user not found!');

    const isFavorited = product.favoritedBy.some((user) => user.id === userId);

    if (isFavorited) {
      product.favoritedBy = product.favoritedBy.filter(
        (product) => product.id !== userId,
      );
    } else {
      product.favoritedBy.push(user);
    }

    await this.productRepository.save(product);
  }

  async getFavoriteProducts(userId: string): Promise<Product[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteProducts'],
    });

    if (!user) throw new NotFoundException('User not found!');

    return user.favoriteProducts;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
