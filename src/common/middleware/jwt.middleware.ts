import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { CommonJwtService } from '../../jwt/common-jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private commonJwtService: CommonJwtService) {}

  /**
   * Access Token 검증
   * @param req
   * @param res
   * @param next
   */
  async use(req: Request, res: Response, next: NextFunction) {
    /**
     * 1. access token 유무 및 유효한가 검사
     * 2. 존재하며 유효한 토큰이라면 요청 url 에 권한이 있는지 검사
     */
    const token = req.headers['authorization'];
    const sessionUser = req.session['user'];
    if (!token && !sessionUser) {
      throw new UnauthorizedException('Session 정보가 없습니다.');
    }
    if (!sessionUser && !this.commonJwtService.validateAccessToken(token)) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
    let authority;
    if (sessionUser) authority = sessionUser.authority;
    //else authority = await this.managerService.getAuthority(token);

    if (authority.length === 0) {
      throw new UnauthorizedException('권한이 없습니다.');
    } else {
      const url = req['baseUrl'];
      if (false) throw new UnauthorizedException('권한이 없습니다.');
    }
    next();
  }
}
