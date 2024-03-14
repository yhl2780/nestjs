import { ApiProperty } from '@nestjs/swagger';

/**
 * mapped-types 참고
 * https://huniroom.tistory.com/entry/NestJSGraphQL-mapped-types-%EC%A0%95%EB%A6%AC
 */

export class S3ResponseDto {
  @ApiProperty({
    description: 'ETag',
    type: 'string',
    example: '\\"9ddce202612a44dc9accad0042d54513\\"',
  })
  ETag: string;

  @ApiProperty({
    description: 'S3 URL',
    type: 'string',
    example:
      'https://s3.amazonaws.com/test/test/...png',
  })
  Location: string;

  @ApiProperty({
    description: '파일 경로(도메인 제외)',
    type: 'string',
    example: 'test/46pDXDhCWpZ8A3kQTgpJT7.png',
  })
  key: string;

  @ApiProperty({
    description: '파일 경로(도메인 제외)',
    type: 'string',
    example: 'test/46pDXDhCWpZ8A3kQTgpJT7.png',
  })
  Key: string;

  @ApiProperty({ description: '버킷명', type: 'string', example: 'test' })
  Bucket: string;
}
