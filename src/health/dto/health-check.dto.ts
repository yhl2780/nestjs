import { ApiProperty } from '@nestjs/swagger';

class memoryInfo {
  @ApiProperty({ description: '상태', type: 'string', example: 'up' })
  status: 'up' | 'down';

  @ApiProperty({
    description: '총 메모리',
    type: 'string',
    example: '15.42 GB (100%)',
  })
  totalMemory: string;

  @ApiProperty({
    description: '사용가능 메모리',
    type: 'string',
    example: '2.23GB GB (14.47%)',
  })
  freeMemory: string;

  @ApiProperty({
    description: '사용중 메모리',
    type: 'string',
    example: '13.19 GB (85.53%)',
  })
  UsedMemory: string;
}

class diskInfo {
  @ApiProperty({ description: '상태', type: 'string', example: 'up' })
  status: 'up' | 'down';

  @ApiProperty({
    description: '디스크 경로',
    type: 'string',
    example: 'C:',
  })
  path: string;

  @ApiProperty({
    description: '총 디스크용량',
    type: 'string',
    example: '183.23 GB (100%)',
  })
  totalDisk: string;

  @ApiProperty({
    description: '사용가능 디스크용량',
    type: 'string',
    example: '33.42GB GB (15.13%)',
  })
  freeDisk: string;

  @ApiProperty({
    description: '사용중 디스크용량',
    type: 'string',
    example: '149.92 GB (84.8%)',
  })
  UsedDisk: string;
}

class uptimeInfo {
  @ApiProperty({ description: '상태', type: 'string', example: 'up' })
  status: 'up' | 'down';

  @ApiProperty({
    description: '업타임 초단위',
    type: 'string',
    example: '26,019초',
  })
  seconds: string;

  @ApiProperty({
    description: '업타임 시간형식',
    type: 'string',
    example: '7시간 13분 39초',
  })
  timeFormat: string;
}

class dbInfo {
  @ApiProperty({ description: '상태', type: 'string', example: 'up' })
  status: 'up' | 'down';

  @ApiProperty({
    description: 'DB 클라이언트',
    type: 'string',
    example: 'prisma',
  })
  client: string;

  @ApiProperty({
    description: 'DB 타임존',
    type: 'string',
    example: 'Asia/Seoul',
  })
  timezone: string;
}

export class HealthCheckDto {
  @ApiProperty({
    description: '메모리 정보',
    type: memoryInfo,
  })
  memory: memoryInfo;

  @ApiProperty({
    description: '디스크 정보',
    type: diskInfo,
  })
  disk: diskInfo;

  @ApiProperty({
    description: '업타임 정보',
    type: uptimeInfo,
  })
  uptime: uptimeInfo;

  @ApiProperty({
    description: '데이터베이스 정보',
    type: dbInfo,
  })
  db: dbInfo;
}
