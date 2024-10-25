import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ICurrentUser } from 'src/common/types/current-user.interface';
import { ProductCreateDto } from './dtos/product-create.dto';
import { ProductFavoriteDto } from './dtos/product-favorite.dto';
import { ProductQueryDto } from './dtos/product-query.dto';
import {
  FavoritedProducts,
  ProductResponseDto,
} from './dtos/product-response.dto';
import { ProductUpdateDto } from './dtos/product-update.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { getProductByIdQueryDto } from './dtos/product-by-id.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Admin)
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ========== GET ALL PRODUCTS ==========
  @PublicRoute()
  @Post('/')
  @ApiOperation({ summary: 'Get All products with queries' })
  @ApiOkResponse({
    description: 'Retrieved all products.',
    type: ProductResponseDto,
  })
  @ApiBody({
    type: ProductQueryDto,
  })
  getProducts(@Body() body: ProductQueryDto): Promise<ProductResponseDto> {
    return this.productsService.getProducts(body);
  }

  // ========== GET PRODUCT BY ID ==========
  @PublicRoute()
  @Post('/id')
  @ApiOperation({ summary: 'Get Product by ID' })
  @ApiOkResponse({
    description: 'Retrieved product by ID.',
    type: FavoritedProducts,
  })
  @ApiBody({
    type: getProductByIdQueryDto,
  })
  getProductById(@Body() body: getProductByIdQueryDto): Promise<Product> {
    return this.productsService.getProductById(body);
  }

  // ========== CREATE PRODUCT ==========
  @Post('/create')
  @ApiOperation({ summary: 'Create Product' })
  @ApiOkResponse({
    description: 'Product created successfully.',
    type: Product,
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  @ApiBody({
    type: ProductCreateDto,
  })
  createProduct(@Body() body: ProductCreateDto): Promise<Product> {
    return this.productsService.createProduct(body);
  }

  // ========== UPDATE PRODUCT ==========
  @Put('/:id')
  @ApiOperation({ summary: 'Update Product' })
  @ApiOkResponse({
    description: 'Product updated successfully.',
    type: Product,
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Product ID',
  })
  @ApiBody({
    type: ProductUpdateDto,
  })
  updateProduct(
    @Param('id') id: string,
    @Body() body: ProductUpdateDto,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, body);
  }

  // ========== FAVORITE PRODUCT ==========
  @Post('/favorite')
  @ApiOperation({ summary: 'Favorite Product' })
  @ApiOkResponse({
    description: 'Product favorited or unfavorited successfully.',
    type: Product,
  })
  @ApiBody({
    type: ProductFavoriteDto,
  })
  @Roles(Role.Customer)
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  favoriteProduct(
    @Body() body: ProductFavoriteDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<void> {
    return this.productsService.favoriteProduct(body.productId, user.userId);
  }

  // ========== GET USER FAVORITE PRODUCTS ==========
  @Get('/user/favorite')
  @ApiOperation({ summary: 'Get user favorite products' })
  @ApiOkResponse({
    description: 'Retrieved user favorite products.',
    type: [Product],
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  @Roles(Role.Customer)
  getFavoriteProducts(@CurrentUser() user: ICurrentUser): Promise<Product[]> {
    return this.productsService.getFavoriteProducts(user.userId);
  }

  // ========== DELETE PRODUCT ==========
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete Product' })
  @ApiResponse({
    status: 204,
    description: 'Product deleted successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Product ID',
  })
  deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productsService.deleteProduct(id);
  }
}