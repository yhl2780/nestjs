import { Logger, Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheck } from './health-check';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [HealthCheck, Logger, PrismaService],
})
export class HealthModule {}
