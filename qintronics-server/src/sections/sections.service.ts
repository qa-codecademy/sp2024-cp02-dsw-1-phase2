import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { Product } from 'src/products/product.entity';
import { DeepPartial, FindOptionsWhere, ILike, Repository } from 'typeorm';
import * as categoriesData from '../data/categories.json';
import * as productsData from '../data/products.json';
import * as sectionsData from '../data/sections.json';
import { SectionCreateDto } from './dtos/section-create.dto';
import { SectionQueryDto } from './dtos/section-query.dto';
import { SectionResponseDto } from './dtos/section-response.dto';
import { SectionUpdateDto } from './dtos/section-update.dto';
import { Section } from './section.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getSections({ name }: SectionQueryDto): Promise<SectionResponseDto[]> {
    let whereQuery = {} satisfies FindOptionsWhere<Section>;

    if (name) {
      whereQuery = {
        ...whereQuery,
        name: ILike(name),
      };
    }

    const sections = await this.sectionRepository.find({
      where: whereQuery,
      relations: {
        categories: true,
      },
    });

    return sections;
  }

  async getSectionById(id: string): Promise<SectionResponseDto> {
    const section = await this.sectionRepository.findOneBy({ id });
    if (!section) throw new NotFoundException('Section not found!');
    return section;
  }

  async createSection(body: SectionCreateDto): Promise<SectionResponseDto> {
    body.name = body.name.toUpperCase();
    const newSection = this.sectionRepository.create(body);
    return this.sectionRepository.save(newSection);
  }

  async backfillSections(): Promise<void> {
    await this.productRepository.delete({});
    await this.categoryRepository.delete({});
    await this.sectionRepository.delete({});

    for (const section of sectionsData) {
      const newSection = this.sectionRepository.create(section);
      await this.sectionRepository.save(newSection);
    }

    const newCategories = this.categoryRepository.create(
      categoriesData as DeepPartial<Category[]>,
    );

    await this.categoryRepository.save(newCategories);

    const newProducts = this.productRepository.create(
      productsData as DeepPartial<Product[]>,
    );

    await this.productRepository.save(newProducts);
  }

  async updateSection(
    id: string,
    body: SectionUpdateDto,
  ): Promise<SectionResponseDto> {
    const section = await this.sectionRepository.findOneBy({ id });

    if (!section) throw new NotFoundException('Section not found!');

    const updatedSection = this.sectionRepository.merge(section, body);
    return this.sectionRepository.save(updatedSection);
  }

  async deleteSection(id: string): Promise<void> {
    await this.productRepository.delete({ categoryId: id });
    await this.categoryRepository.delete({ sectionId: id });
    await this.sectionRepository.delete({ id });
  }
}
