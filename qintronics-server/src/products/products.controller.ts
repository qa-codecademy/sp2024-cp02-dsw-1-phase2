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
import { ProductsService } from './products.service';
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
import { ProductResponseDto } from './dtos/product-response.dto';
import { Product } from './product.entity';
import { ProductCreateDto } from './dtos/product-create.dto';
import { ProductUpdateDto } from './dtos/product-update.dto';
import { ProductQueryDto } from './dtos/product-query.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/roles.enum';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ICurrentUser } from 'src/common/types/current-user.interface';
import { ProductFavoriteDto } from './dtos/product-favorite.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Admin)
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ========== GET ALL PRODUCTS ==========
  @PublicRoute()
  @Get('/')
  @ApiOperation({ summary: 'Get Products' })
  @ApiOkResponse({
    description: 'Retrieved all products.',
    type: ProductResponseDto,
  })
  @ApiQuery({
    type: Boolean,
    name: 'discount',
    description: 'Discounted Products',
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'name',
    description: 'Product Name',
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'brand',
    description: 'Product Brand',
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'categoryName',
    description: 'Category Name',
    required: false,
  })
  @ApiQuery({
    type: Number,
    name: 'page',
    description: 'Page Number',
    required: false,
  })
  @ApiQuery({
    type: Number,
    name: 'pageSize',
    description: 'Page Size',
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'sortBy',
    description: 'Sort By',
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'sort',
    description: 'Sort order (ASC or DESC)',
    required: false,
  })
  getProducts(@Query() query: ProductQueryDto): Promise<ProductResponseDto> {
    return this.productsService.getProducts(query);
  }

  // ========== GET PRODUCT BY ID ==========
  @PublicRoute()
  @Get('/:id')
  @ApiOperation({ summary: 'Get Product by ID' })
  @ApiOkResponse({
    description: 'Retrieved product by ID.',
    type: Product,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Product ID',
  })
  getProductById(@Param('id') id: string): Promise<Product> {
    return this.productsService.getProductById(id);
  }

  // ========== CREATE PRODUCT ==========
  @Post('/')
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
