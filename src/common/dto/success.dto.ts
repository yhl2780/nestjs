import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional } from 'class-validator';
import { isEmpty } from '../util/common.util';
import * as moment from 'moment';

class metadata {
  @ApiProperty({
    description: '총 개수',
    required: true,
    example: 1,
  })
  totalCount: number;
}

export class SuccessDto {
  constructor(resource?: any[] | [] | object, metadata?: object) {
    if (typeof resource !== 'undefined') this.data = resource;
    if (!isEmpty(metadata)) this.metaData = metadata;
  }

  @ApiProperty({
    example: moment(new Date()).unix(),
    description: 'unix time stamp',
    required: true,
  })
  @IsNumber()
  processedDateTime: number;

  @ApiProperty({
    description: 'metadata',
    required: false,
    type: metadata,
  })
  @IsObject()
  @IsOptional()
  metaData: object | null;

  @IsObject()
  @IsOptional()
  data: any[] | object | null;
}
