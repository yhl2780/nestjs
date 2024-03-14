import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'passport-refresh-token',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload) {
    // const result = await this.managerInfoService.checkPayload(payload);
    // if (isEmpty(result)) {
    //   throw new UnauthorizedException('접근 오류');
    // }
    // return result;
  }
}
