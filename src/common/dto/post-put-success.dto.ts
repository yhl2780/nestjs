import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional } from 'class-validator';
import { isEmpty } from '../util/common.util';
import * as moment from 'moment';

export class PostPutSuccessDto {
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

  @IsObject()
  @IsOptional()
  metaData: object | null;

  @IsObject()
  @IsOptional()
  data: any[] | object | null;
}
