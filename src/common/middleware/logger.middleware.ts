import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(RequestInfoForm(req));

    next();
  }
}

/**
 * Request query, Request body -> JSON String
 * @param req Request
 */
function RequestInfoForm(req) {
  const logArr = [];
  logArr.push(`[${req.method}] :: ${decodeURIComponent(req.baseUrl)}`);

  if (Object.keys(req.query).length > 0) {
    logArr.push(` - [Query] ${JSON.stringify(req.query)}`);
  }

  if (Object.keys(req.body).length > 0) {
    logArr.push(` - [Body] ${JSON.stringify(req.body)}`);
  }

  return logArr.join('\n');
}
