import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsUUID } from 'class-validator';

export class LogoutDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    type: String,
    description: `User's ID`,
    example: '0ff3e9c2-ec93-4735-a1da-50c834a78ffc',
  })
  userId: string;

  @IsNotEmpty()
  @IsJWT()
  @ApiProperty({
    type: String,
    description: `User's refresh token`,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZjcxMjhmYi05MGUxLTQ5MzUtOTkzYy00ZGI3YmJhYTQ0ZjYiLCJ1c2VySWQiOiI0ZjcxMjhmYi05MGUxLTQ5MzUtOTkzYy00ZGI3YmJhYTQ0ZjYiLCJlbWFpbCI6ImN1c3RvbWVyQGV4YW1wbGUuY29tIiwicm9sZSI6IkN1c3RvbWVyIiwiaWF0IjoxNzI3NzI0OTgxLCJleHAiOjE3Mjc4MTEzODEsImlzcyI6IlFpbnRyb25pY3MifQ.GSwJ-dVxSG7LEcTkLGEFQ8BX9RT5MihZnX_pRurSyG8',
  })
  refreshToken: string;
}
