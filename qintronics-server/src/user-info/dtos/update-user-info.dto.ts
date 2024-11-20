import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  MinDate,
  MinLength,
} from 'class-validator';

export class UpdateUserInfoDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiPropertyOptional({
    type: String,
    description: `User's first name`,
    example: 'Marija',
  })
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiPropertyOptional({
    type: String,
    description: `User's last name`,
    example: 'Menchevska',
  })
  lastName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiPropertyOptional({
    type: String,
    description: `User's phone number`,
    example: '+3891234578',
  })
  phone?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiPropertyOptional({
    type: String,
    description: `User's address`,
    example: 'Partizanska, bb',
  })
  address?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiPropertyOptional({
    type: String,
    description: `User's city`,
    example: 'Skopje',
  })
  city?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    type: Number,
    description: `User's postal code`,
    example: 1000,
  })
  postalCode?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiPropertyOptional({
    type: String,
    description: `User's country`,
    example: 'Macedonia',
  })
  country?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiPropertyOptional({
    type: String,
    description: `Card name`,
    example: 'Jane Doe',
  })
  ccFullName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsNumberString()
  @Length(16, 16)
  @Matches(/^(34|37|4|5|6)/, {
    message: 'ccNum must start with 34, 37, 4, 5 or 6',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiPropertyOptional({
    type: String,
    description: `Card number`,
    example: '0123495678012345',
  })
  ccNum?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  @MinDate(new Date(), { message: `Expiration date can't be in the past.` })
  @Transform(({ value }) =>
    typeof value === 'string' ? new Date(value) : value,
  )
  @ApiPropertyOptional({
    type: Date,
    description: `Card expiration date`,
    example: '2024-05-01 00:00:00',
  })
  expDate?: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(100)
  @Max(9999)
  @Transform(({ value }) => parseInt(value))
  @ApiPropertyOptional({
    type: Number,
    description: `CVV card number`,
    example: '123 or 1234',
  })
  cvv?: number;
}
