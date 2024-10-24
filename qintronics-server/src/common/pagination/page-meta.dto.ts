import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from './page-options.dto';

export interface PageMetaDtoParameters {
  paginationQueries: PageOptionsDto;
  itemCount: number;
}

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly perPage: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ paginationQueries, itemCount }: PageMetaDtoParameters) {
    this.page = paginationQueries.page ?? 1;
    this.perPage = paginationQueries.perPage ?? 10;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.perPage);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
