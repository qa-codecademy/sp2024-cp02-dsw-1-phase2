import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokensResponse {
  @ApiProperty({
    type: String,
    description: `User's new access token`,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZjcxMjhmYi05MGUxLTQ5MzUtOTkzYy00ZGI3YmJhYTQ0ZjYiLCJ1c2VySWQiOiI0ZjcxMjhmYi05MGUxLTQ5MzUtOTkzYy00ZGI3YmJhYTQ0ZjYiLCJlbWFpbCI6ImN1c3RvbWVyQGV4YW1wbGUuY29tIiwicm9sZSI6IkN1c3RvbWVyIiwiaWF0IjoxNzI3NzI0OTgxLCJleHAiOjE3Mjc4MTEzODEsImlzcyI6IlFpbnRyb25pY3MifQ.GSwJ-dVxSG7LEcTkLGEFQ8BX9RT5MihZnX_pRurSyG8',
  })
  newAccessToken: string;

  @ApiProperty({
    type: String,
    description: `User's new refresh token`,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZjcxMjhmYi05MGUxLTQ5MzUtOTkzYy00ZGI3YmJhYTQ0ZjYiLCJ1c2VySWQiOiI0ZjcxMjhmYi05MGUxLTQ5MzUtOTkzYy00ZGI3YmJhYTQ0ZjYiLCJlbWFpbCI6ImN1c3RvbWVyQGV4YW1wbGUuY29tIiwicm9sZSI6IkN1c3RvbWVyIiwiaWF0IjoxNzI3NzI0OTgxLCJleHAiOjE3Mjc4MTEzODEsImlzcyI6IlFpbnRyb25pY3MifQ.GSwJ-dVxSG7LEcTkLGEFQ8BX9RT5MihZnX_pRurSyG8',
  })
  newRefreshToken: string;
}
