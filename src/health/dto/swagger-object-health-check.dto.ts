import { ApiProperty, PickType } from '@nestjs/swagger';
import { SuccessDto } from '../../common/dto/success.dto';
import { HealthCheckDto } from './health-check.dto';

export class SwaggerObjectHealthCheckDto extends PickType(SuccessDto, [
  'processedDateTime',
] as const) {
  @ApiProperty({
    description: '데이터',
    required: false,
    type: HealthCheckDto,
  })
  data: HealthCheckDto;
}
