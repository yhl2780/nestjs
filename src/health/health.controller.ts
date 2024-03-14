import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck } from './health-check';
import { SuccessDto } from '../common/dto/success.dto';
import { SwaggerObjectHealthCheckDto } from './dto/swagger-object-health-check.dto';
import { HealthCheckFailDto } from './dto/health-check-fail.dto';

@Controller('health')
@ApiTags('Health Check')
export class HealthController {
  constructor(private readonly healthCheck: HealthCheck) {}

  @ApiResponse({
    status: 200,
    description: '헬스체크 성공',
    type: SwaggerObjectHealthCheckDto,
  })
  @ApiResponse({
    status: 503,
    description: '메모리, 디스크 조회 혹은 DB 연결 문제 발생',
    type: HealthCheckFailDto,
  })
  @ApiOperation({
    summary: '헬스 체크',
    description: '상태를 확인합니다.',
  })
  @Get()
  async memory(): Promise<SuccessDto> {
    const memory = await this.healthCheck.memoryHealthCheck('memory');
    const disk = await this.healthCheck.diskHealthCheck('disk');
    const uptime = await this.healthCheck.uptimeCheck('uptime');
    const db = await this.healthCheck.dbCheck('db');

    return new SuccessDto({
      memory: memory['memory'],
      disk: disk['disk'],
      uptime: uptime['uptime'],
      db: db['db'],
    });
  }
}
