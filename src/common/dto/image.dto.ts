import { ApiProperty } from '@nestjs/swagger';

/**
 * mapped-types 참고
 * https://huniroom.tistory.com/entry/NestJSGraphQL-mapped-types-%EC%A0%95%EB%A6%AC
 */

export class ImageDto {
  @ApiProperty({ description: '파일', type: 'file' })
  file: string;

  @ApiProperty({
    description: '폴더명 ( default 는 images )',
    type: 'string',
    required: false,
    example: 'notice',
  })
  folderName: string;
}
