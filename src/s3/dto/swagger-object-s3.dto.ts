import { ApiProperty, PickType } from '@nestjs/swagger';
import { SuccessDto } from '../../common/dto/success.dto';
import { S3ResponseDto } from './s3-upload-response.dto';

class uploadObject {
  @ApiProperty({
    description: 'S3 Response 객체',
    required: false,
    type: S3ResponseDto,
  })
  sendData: object;

  @ApiProperty({
    description: '파일 원본명',
    required: false,
    type: 'string',
    example: 'thumbnail.png',
  })
  originalName: object;
}

export class SwaggerObjectS3Dto extends PickType(SuccessDto, [
  'processedDateTime',
  'metaData',
] as const) {
  @ApiProperty({
    description: '데이터',
    required: false,
    type: uploadObject,
  })
  data: uploadObject;
}
