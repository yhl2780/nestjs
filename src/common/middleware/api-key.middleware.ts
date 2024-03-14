import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { isEmpty } from '../util/common.util';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  /**
   * API Key 검증
   * @param req
   * @param res
   * @param next
   */
  use(req: Request, res: Response, next: NextFunction) {
    if (
      isEmpty(req.headers['api-key']) ||
      req.headers['api-key'] !== process.env.API_KEY
    ) {
      throw new UnauthorizedException('Invalidate API Key');
    }
    next();
  }
}
