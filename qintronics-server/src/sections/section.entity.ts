import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from 'src/categories/category.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Section {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: String,
    description: 'Section ID',
    example: '0ff3e9c2-ec93-4735-a1da-50c834a78ffc',
  })
  id: string;

  @Column()
  @ApiProperty({
    type: String,
    description: 'Section name',
    example: 'Electronics',
  })
  name: string;

  @OneToMany(() => Category, (category) => category.section)
  @ApiPropertyOptional({
    type: Category,
  })
  categories: Category[];

  @CreateDateColumn()
  @ApiProperty({
    type: String,
    description: 'Category created date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    type: String,
    description: 'Category updated date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @DeleteDateColumn()
  @ApiProperty({
    type: String,
    description: 'Category updated date',
    example: '2023-01-01T00:00:00.000Z',
  })
  deletedAt: Date;
}
