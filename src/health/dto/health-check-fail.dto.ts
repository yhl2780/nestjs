import { ApiProperty, PickType } from '@nestjs/swagger';
import { SuccessDto } from '../../common/dto/success.dto';

class failInfo {
  @ApiProperty({ description: '상태', type: 'string', example: 'down' })
  status: 'down';
}

class ReadHealthCheckFail {
  @ApiProperty({
    description: '메모리 정보',
    type: failInfo,
  })
  memory: failInfo;

  @ApiProperty({
    description: '디스크 정보',
    type: failInfo,
  })
  disk: failInfo;

  @ApiProperty({
    description: '업타임 정보',
    type: failInfo,
  })
  uptime: failInfo;

  @ApiProperty({
    description: '데이터베이스 정보',
    type: failInfo,
  })
  db: failInfo;
}

export class HealthCheckFailDto extends PickType(SuccessDto, [
  'processedDateTime',
] as const) {
  @ApiProperty({
    description: '데이터',
    required: false,
    type: ReadHealthCheckFail,
  })
  data: ReadHealthCheckFail;
}
