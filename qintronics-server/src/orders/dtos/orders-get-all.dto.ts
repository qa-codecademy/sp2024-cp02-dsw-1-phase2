import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/pagination/page-options.dto';
import { OrderQueryDto } from './order-query.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllOrdersDto {
  @ApiPropertyOptional({
    type: PageOptionsDto,
    description: 'Pagination options',
  })
  @ValidateNested()
  @Type(() => PageOptionsDto)
  paginationQueries?: PageOptionsDto;

  @ApiPropertyOptional({
    type: OrderQueryDto,
    description: 'Query options',
  })
  @ValidateNested()
  @Type(() => OrderQueryDto)
  queryParams?: OrderQueryDto;
}