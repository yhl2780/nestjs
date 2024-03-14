import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * mapped-types 참고
 * https://huniroom.tistory.com/entry/NestJSGraphQL-mapped-types-%EC%A0%95%EB%A6%AC
 */

export class S3DeleteDto {
  @ApiProperty({
    description: '폴더 + 파일명',
    type: 'string',
    example: 'board/46pDXDhCWpZ8A3kQTgpJT7.png',
  })
  @IsString({
    message: 'deleteFileName 문자열이어야합니다.',
  })
  @IsNotEmpty({
    message: 'deleteFileName 필수 값입니다.',
  })
  deleteFileName: string;
}
