import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import * as os from 'os';
import checkDiskSpace from 'check-disk-space';
import { PrismaService } from '../prisma.service';

@Injectable()
export class HealthCheck extends HealthIndicator {
  private readonly sizeObj: object;
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {
    super();
    this.sizeObj = { B: 0, KB: 1, MB: 2, GB: 3 };
  }

  /**
   * 메모리 확인
   * key -> memory
   * @param key
   */
  async memoryHealthCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      const calc = this.percentCalculator(os.totalmem(), os.freemem());
      const memoryInfo = {
        totalMemory: `${this.sizeFormat(calc.total)} (100%)`,
        freeMemory: `${this.sizeFormat(calc.free)} (${calc.freePercent}%)`,
        usedMemory: `${this.sizeFormat(calc.used)} (${calc.usedPercent}%)`,
      };
      const result = await this.getStatus(key, true, memoryInfo);
      this.logger.log(result);

      return result;
    } catch (e) {
      this.logger.error(e);
      const result = this.getStatus(key, false);
      this.logger.error(result);

      return result;
    }
  }

  /**
   * 디스크 확인
   * key -> disk
   * @param key
   */
  async diskHealthCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      // node-os-utils -> windows support X
      const disk = await checkDiskSpace(os.platform() === 'win32' ? 'C:' : '/');
      const calc = this.percentCalculator(disk.size, disk.free);
      const diskInfo = {
        path: disk.diskPath,
        totalDisk: `${this.sizeFormat(calc.total)} (100%)`,
        freeDisk: `${this.sizeFormat(calc.free)} (${calc.freePercent}%)`,
        usedDisk: `${this.sizeFormat(calc.used)} (${calc.usedPercent}%)`,
      };
      const result = this.getStatus(key, true, diskInfo);
      this.logger.log(result);

      return result;
    } catch (e) {
      this.logger.error(e);
      const result = this.getStatus(key, false);
      this.logger.error(result);

      return result;
    }
  }

  /**
   * 업타임 확인
   * key -> uptime
   * @param key
   */
  async uptimeCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      const uptime = os.uptime();
      const seconds = uptime % 60;
      const minutes = Math.floor((uptime % 3600) / 60);
      const hours = Math.floor(uptime / 3600);
      const timeInfo = {
        seconds: `${uptime.toLocaleString()}초`,
        timeFormat: `${hours}시간 ${minutes}분 ${seconds}초`,
      };
      const result = this.getStatus(key, true, timeInfo);
      this.logger.log(result);

      return result;
    } catch (e) {
      this.logger.error(e);
      const result = this.getStatus(key, false);
      this.logger.error(result);

      return result;
    }
  }

  /**
   * 데이터베이스 확인
   * key -> db
   * @param key
   */
  async dbCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      const timezone = await this.prismaService.$queryRaw`SELECT @@time_zone`;
      const result = this.getStatus(key, true, { client: 'prisma', timezone });
      this.logger.log(result);

      return result;
    } catch (e) {
      this.logger.error(e);
      const result = this.getStatus(key, false);
      this.logger.error(result);

      return result;
    }
  }

  /**
   * size format 변경
   * @param size
   * @param from
   * @param to
   */
  private sizeFormat(
    size: number,
    from: 'B' | 'KB' | 'MB' | 'GB' = 'B',
    to: 'B' | 'KB' | 'MB' | 'GB' = 'GB',
  ): string {
    const diff = this.sizeObj[from] - this.sizeObj[to];
    let result = size;
    if (diff > 0) {
      //양수 -> 큰 사이즈에서 작은 사이즈로
      for (let i = 0; i < diff; i++) {
        result = result * 1024;
      }
    } else {
      //음수 -> 작은 사이즈에서 큰 수로
      for (let i = 0; i < diff * -1; i++) {
        result = result / 1024;
      }
    }

    return `${Math.round(result * 100) / 100} ${to}`;
  }

  /**
   * 퍼센트 및 총합 계산
   * @param total
   * @param free
   */
  private percentCalculator(
    total: number,
    free: number,
  ): {
    total: number;
    free: number;
    used: number;
    freePercent: number;
    usedPercent: number;
  } {
    return {
      total,
      free,
      used: total - free,
      freePercent: Math.round((free / total) * 100 * 100) / 100, //소수점 2자리
      usedPercent: Math.round(((total - free) / total) * 100 * 100) / 100, //소수점 2자리
    };
  }
}
