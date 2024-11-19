import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import {
  Equal,
  FindOptionsWhere,
  ILike,
  MoreThan,
  Not,
  Repository,
} from 'typeorm';
import { ProductCreateDto } from './dtos/product-create.dto';
import { ProductQueryDto } from './dtos/product-query.dto';
import { ProductUpdateDto } from './dtos/product-update.dto';
import { Product } from './product.entity';
import {
  FavoritedProducts,
  ProductResponseDto,
} from './dtos/product-response.dto';
import { getProductByIdQueryDto } from './dtos/product-by-id.dto';

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
    userId,
    random = false,
    includeGiftCards = false,
  }: ProductQueryDto): Promise<ProductResponseDto> {
    let whereQuery: FindOptionsWhere<Product> = {};

    const giftCardCategory = await this.categoryRepository.findOne({
      where: { name: ILike('Gift Cards') },
    });

    if (!includeGiftCards && giftCardCategory) {
      whereQuery = {
        ...whereQuery,
        categoryId: Not(Equal(giftCardCategory.id)),
      };
    }

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

    let products: Product[] = [];
    let total = 0;

    if (random) {
      products = await this.productRepository
        .createQueryBuilder('product')
        .where(whereQuery)
        .andWhere('product.categoryId != :giftCardCategoryId', {
          giftCardCategoryId: giftCardCategory?.id,
        })
        .orderBy('RANDOM()')
        .take(pageSize)
        .getMany();

      total = products.length;
    } else {
      const [paginatedProducts, totalCount] =
        await this.productRepository.findAndCount({
          where: whereQuery,
          skip: (page - 1) * pageSize,
          take: pageSize,
          order: {
            [sortBy]: sort,
          },
        });

      products = paginatedProducts;
      total = totalCount;
    }

    let favoriteProductIds: string[] = [];
    if (userId) {
      const favorites = await this.getFavoriteProducts(userId);
      favoriteProductIds = favorites.map((product) => product.id);
    }

    const productsWithFavorites = products.map((product) => ({
      ...product,
      isFavorite: favoriteProductIds.includes(product.id),
    }));

    const totalPages = Math.ceil(total / pageSize);

    const payload: ProductResponseDto = {
      products: productsWithFavorites,
      total: total,
      next: page < totalPages,
      prev: page > 1,
    };

    return payload;
  }

  async getProductById({
    productId,
    userId,
  }: getProductByIdQueryDto): Promise<FavoritedProducts> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) throw new NotFoundException('Product not found!');
    let isFavorite = false;
    if (userId) {
      const favorites = await this.getFavoriteProducts(userId);
      const favoriteProductIds = favorites.map((favProduct) => favProduct.id);
      isFavorite = favoriteProductIds.includes(product.id);
    }
    return {
      ...product,
      isFavorite,
    };
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

  async getFavoriteProducts(userId: string): Promise<FavoritedProducts[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteProducts'],
    });

    if (!user) throw new NotFoundException('User not found!');

    return user.favoriteProducts.map((product) => ({
      ...product,
      isFavorite: true,
    }));
  }

  async deleteProduct(id: string): Promise<void> {
    const deletedAnswer = await this.productRepository.softDelete(id);

    if (!deletedAnswer.affected) {
      throw new NotFoundException('Product not found!');
    }
  }
}
