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
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SectionCreateDto } from './dtos/section-create.dto';
import { SectionQueryDto } from './dtos/section-query.dto';
import { SectionResponseDto } from './dtos/section-response.dto';
import { SectionUpdateDto } from './dtos/section-update.dto';
import { Section } from './section.entity';
import { SectionsService } from './sections.service';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Admin)
@ApiTags('Sections')
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  // ========== GET ALL SECTIONS ==========
  @Get('/')
  @PublicRoute()
  @ApiOperation({ summary: 'Get Sections' })
  @ApiOkResponse({
    description: 'Retrieved all sections.',
    type: [SectionResponseDto],
  })
  @ApiQuery({
    name: 'name',
    description: 'Section Name',
    required: false,
    type: String,
  })
  getSections(@Query() query: SectionQueryDto): Promise<SectionResponseDto[]> {
    return this.sectionsService.getSections(query);
  }

  // ========== GET SECTION BY ID ==========
  @Get('/:id')
  @ApiOperation({ summary: 'Get Section by ID' })
  @ApiOkResponse({
    description: 'Retrieved section by ID',
    type: Section,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Section ID',
  })
  getSectionById(@Param('id') id: string): Promise<SectionResponseDto> {
    return this.sectionsService.getSectionById(id);
  }

  // ========== CREATE SECTION ==========
  @Post('/')
  @ApiOperation({ summary: 'Create Section' })
  @ApiOkResponse({
    description: 'Section created successfully.',
    type: Section,
  })
  @ApiBody({
    type: SectionCreateDto,
  })
  createSection(@Body() body: SectionCreateDto): Promise<SectionResponseDto> {
    return this.sectionsService.createSection(body);
  }

  // ========== BACKFILL SECTIONS ==========
  @PublicRoute()
  @Post('/backfill')
  @ApiOperation({ summary: 'Backfill Sections' })
  @ApiOkResponse({
    description: 'Sections backfilled successfully.',
  })
  backfillSections(): Promise<void> {
    return this.sectionsService.backfillSections();
  }

  // ========== UPDATE SECTION ==========
  @Put('/:id')
  @ApiOperation({ summary: 'Update Section' })
  @ApiOkResponse({
    description: 'Section updated successfully.',
    type: Section,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Section ID',
  })
  @ApiBody({
    type: SectionUpdateDto,
  })
  updateSection(
    @Param('id') id: string,
    @Body() body: SectionUpdateDto,
  ): Promise<SectionResponseDto> {
    return this.sectionsService.updateSection(id, body);
  }

  // ========== DELETE SECTION ==========
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete Section' })
  @ApiResponse({
    status: 204,
    description: 'Section deleted successfully.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Section ID',
  })
  deleteSection(@Param('id') id: string): Promise<void> {
    return this.sectionsService.deleteSection(id);
  }
}
