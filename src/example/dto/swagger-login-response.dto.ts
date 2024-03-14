import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { SuccessDto } from '../../common/dto/success.dto';

/**
 * mapped-types 참고
 * https://huniroom.tistory.com/entry/NestJSGraphQL-mapped-types-%EC%A0%95%EB%A6%AC
 */

class jwtDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1hbmR5IiwibWFuYWdlcl9zbiI6IjEiLCJuYW1lIjoi7Jyg7Zqo66a8IiwiaWF0IjoxNjQ5NzU3MDg5LCJleHAiOjE2NDk3NjA2ODl9.BWPTZou9Qxic8_Bq2x96OQUp7FuQTwm2At6ZFESjh0k',
    description: '액세스 토큰',
    required: true,
  })
  @IsString()
  access_token?: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1hbmR5IiwiaWF0IjoxNjQ5NzU3MDg5LCJleHAiOjE2NTAzNjE4ODl9.DVwaC2lfRLo366d5MweRvkH8pg6hJixII1iSTY2rnT0',
    description: '리프레시 토큰',
    required: true,
  })
  @IsString()
  refresh_token?: string;
}

export class SwaggerLoginResponse extends PickType(SuccessDto, [
  'processedDateTime',
  'metaData',
] as const) {
  @ApiProperty({
    description: '데이터',
    required: false,
    type: jwtDto,
  })
  data: jwtDto;
}
