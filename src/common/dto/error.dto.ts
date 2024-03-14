import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

const getProperty = (...messages) => {
  return {
    example: messages,
    description: '메세지',
    required: true,
  };
};

export class BadRequestErrorDto {
  @ApiProperty(
    getProperty('sort_no 필수 값입니다.', 'sort_no 정수이어야 합니다.'),
  )
  @IsArray()
  message: string[];
}

export class UnauthorizedErrorDto {
  @ApiProperty(getProperty('api-key 가 누락되었습니다.'))
  @IsArray()
  message: string[];
}

export class NotFoundErrorDto {
  @ApiProperty(getProperty('해당하는 파일이 없습니다.'))
  @IsArray()
  message: string[];
}

export class InternalServerErrorDto {
  @ApiProperty(getProperty('요청을 실패했습니다.'))
  @IsArray()
  message: string[];
}

export class DuplicateIDErrorDto {
  @ApiProperty(getProperty('사용중인 아이디입니다.'))
  @IsArray()
  message: string[];
}

export class ErrorDto {
  @ApiProperty(getProperty('에러 메세지'))
  @IsArray()
  message: string[];
}
