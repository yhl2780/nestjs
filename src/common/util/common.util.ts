/**
 * 3자리마다 컴마
 * @param value
 */
import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export const numberFormat = (value: number) => {
  return value.toLocaleString();
};

/**
 * throw exception
 * @param e
 */
export const throwException = (e) => {
  if (e.status === 400) {
    throw new BadRequestException(e.message || 'Bad Request Exception');
  } else if (e.status === 401) {
    throw new UnauthorizedException(e.message || 'Unauthorized Exception');
  } else if (e.status === 404) {
    throw new NotFoundException(e.message || 'Not Found Exception');
  } else if (e.status === 500) {
    throw new InternalServerErrorException(
      e.message || 'Internal Server Error Exception',
    );
  } else {
    throw new HttpException(
      { message: e.message || 'Server Error' },
      e.status || 500,
    );
  }
};

/**
 * 파라미터 null 확인
 * @param obj
 */
export const isEmpty = (obj?: any) => {
  if (obj === null || obj === undefined || typeof obj === 'undefined') {
    return true;
  } else if (typeof obj === 'number') {
    return isNaN(obj);
  } else if (typeof obj === 'string') {
    return obj === '';
  } else if (typeof obj === 'object') {
    return Object.keys(obj).length === 0;
  } else {
    //그 외에는 값이 비어있지 않음
    return false;
  }
};
