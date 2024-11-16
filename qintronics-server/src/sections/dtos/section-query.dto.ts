import { IsOptional, IsString } from 'class-validator';

export class SectionQueryDto {
  @IsString()
  @IsOptional()
  name?: string;
}
