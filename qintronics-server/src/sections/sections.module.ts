import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { Product } from 'src/products/product.entity';
import { Section } from './section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Section, Category, Product])],
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule {}
