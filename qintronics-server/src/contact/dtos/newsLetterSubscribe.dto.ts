import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNegative, IsNotEmpty } from 'class-validator';

export class newsletterSubscribeDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'User email.',
    example: 'john.doe@example.com',
  })
  email: string;
}
