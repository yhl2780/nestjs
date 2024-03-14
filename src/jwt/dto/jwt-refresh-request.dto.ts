import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * mapped-types 참고
 * https://huniroom.tistory.com/entry/NestJSGraphQL-mapped-types-%EC%A0%95%EB%A6%AC
 */
export class JwtRefreshRequestDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1hbmR5IiwiaWF0IjoxNjQ5ODMxMTk4LCJleHAiOjE2NTA0MzU5OTh9.BC7-OQ-QkA3lt6EoC98wFmzZhA01DU9FvXe4vMr9eaI',
    description: 'JWT Refresh Token',
    required: true,
  })
  @IsString()
  refresh_token: string;

  @ApiProperty({
    example: 'mandy',
    description: '로그인된 계정의 ID',
    required: true,
  })
  @IsString()
  login_id: string;
}
