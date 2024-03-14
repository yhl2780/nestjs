import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorDto } from '../dto/error.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    //const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const err = exception.getResponse();

    if (!Array.isArray(err['message'])) {
      //Multer -> limits -> fileSize
      if (status === 413)
        err[
          'message'
        ] = `${process.env.FILE_UPLOAD_SIZE}MB 이하 파일만 업로드 가능합니다.`;
      err['message'] = new Array(err['message']);
    }

    const errorDto = new ErrorDto();
    errorDto.message = err['message'];

    res.status(status).json(errorDto);
  }
}
