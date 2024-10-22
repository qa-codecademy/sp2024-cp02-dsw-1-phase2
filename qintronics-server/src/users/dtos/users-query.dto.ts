import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UsersQueryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  search?: string;
}
