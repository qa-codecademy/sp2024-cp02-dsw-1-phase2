import { Category } from 'src/categories/category.entity';
import { SectionCreateDto } from './section-create.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SectionResponseDto extends SectionCreateDto {
  @ApiProperty({
    type: String,
    description: 'Section unique ID in UUID format',
    example: '0ff3e9c2-ec93-4735-a1da-50c834a78ffc',
  })
  id: string;

  @ApiProperty({
    type: () => Category,
    description: 'The categories of the section',
    example: [
      {
        id: '847f984d-8b14-4589-bc2b-e58d6be0b24b',
        name: 'Laptops',
      },
    ],
  })
  categories: Category[];

  @ApiProperty({
    type: Date,
    description: 'Section created date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Section updated date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
