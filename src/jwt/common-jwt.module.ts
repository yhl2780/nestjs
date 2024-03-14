import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport/access.strategy';
import { JwtRefreshStrategy } from './passport/refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { CommonJwtService } from './common-jwt.service';
import { CommonJwtController } from './common-jwt.controller';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({}),
  ],
  controllers: [CommonJwtController],
  providers: [CommonJwtService, JwtStrategy, JwtRefreshStrategy, PrismaService],
  exports: [
    CommonJwtService,
    PassportModule.register({ session: false }),
    JwtModule.register({}),
  ],
})
export class CommonJwtModule {}
