import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

// 세션 확인 인터셉터
@Injectable()
export class ReturnInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //const req = context.switchToHttp().getRequest();
    //const res = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((returnObj) => ({
        processedDateTime: moment(new Date()).unix(),
        metaData: returnObj.metaData,
        data: returnObj.data,
      })),
    );
  }
}
