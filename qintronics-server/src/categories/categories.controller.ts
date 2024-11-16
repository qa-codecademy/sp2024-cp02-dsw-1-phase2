import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Admin)
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ========== GET ALL CATEGORIES ==========
  @Get('/')
  @PublicRoute()
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
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: path.join(
          __dirname,
          '../../../qintronics-client/qintronics-app/public/data/images/category-icons',
        ),
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}${path.extname(file.originalname)}`);
        },
      }),

      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
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
    @UploadedFile() icon: Express.Multer.File,
  ): Promise<CategoryResponseDto> {
    if (!icon) {
      throw new Error('Icon file is required');
    }
    const iconURL = `/data/images/category-icons/${icon.filename}`;
    body.iconURL = iconURL;

    return this.categoriesService.createCategory(body);
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
