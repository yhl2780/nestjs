import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * mapped-types 참고
 * https://huniroom.tistory.com/entry/NestJSGraphQL-mapped-types-%EC%A0%95%EB%A6%AC
 */
export class LoginRequestDto {
  @ApiProperty({ example: 'tester', description: 'ID', required: true })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'tester123',
    description: '패스워드',
    required: true,
  })
  @IsString()
  password: string;
}
