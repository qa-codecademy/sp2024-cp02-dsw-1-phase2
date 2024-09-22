import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryCreateDto } from './dtos/category-create.dto';
import { Category } from './category.entity';
import { CategoryResponseDto } from './dtos/category-response.dto';
import { CategoryUpdateDto } from './dtos/category-update.dto';
import { CategoryQueryDto } from './dtos/category-query.dto';
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ========== GET ALL CATEGORIES ==========
  @Get('/')
  @ApiOperation({ summary: 'Get Categories' })
  @ApiOkResponse({
    description: 'Retrieved all categories.',
    type: [Category],
  })
  @ApiQuery({
    name: 'name',
    description: 'Category Name',
    required: false,
    type: String,
  })
  getCategories(
    @Query() query: CategoryQueryDto,
  ): Promise<CategoryResponseDto[]> {
    return this.categoriesService.getCategories(query);
  }

  // ========== GET CATEGORY BY ID ==========
  @Get('/:id')
  @ApiOperation({ summary: 'Get Category by ID' })
  @ApiOkResponse({
    description: 'Retrieved category by ID',
    type: Category,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Category ID',
  })
  getCategoryById(@Param('id') id: string): Promise<CategoryResponseDto> {
    return this.categoriesService.getCategoryById(id);
  }

  // ========== CREATE CATEGORY ==========
  @Post('/')
  @ApiOperation({ summary: 'Create Category' })
  @ApiOkResponse({
    description: 'Category created successfully.',
    type: Category,
  })
  @ApiBody({
    type: CategoryCreateDto,
  })
  createCategory(
    @Body() body: CategoryCreateDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.createCategory(body);
  }

  // ========== BACKFILL CATEGORIES ==========
  @Post('/backfill')
  @ApiOperation({ summary: 'Backfill Categories' })
  @ApiOkResponse({
    description: 'Categories backfilled successfully.',
  })
  backfillCategories(): Promise<void> {
    return this.categoriesService.backfillCategories();
  }

  // ========== UPDATE CATEGORY ==========
  @Put('/:id')
  @ApiOperation({ summary: 'Update Category' })
  @ApiOkResponse({
    description: 'Category updated successfully.',
    type: Category,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Category ID',
  })
  @ApiBody({
    type: CategoryUpdateDto,
  })
  updateCategory(
    @Param('id') id: string,
    @Body() body: CategoryUpdateDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.updateCategory(id, body);
  }

  // ========== DELETE CATEGORY ==========
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete Category' })
  @ApiResponse({
    status: 204,
    description: 'Category deleted successfully.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Category ID',
  })
  deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoriesService.deleteCategory(id);
  }
}
