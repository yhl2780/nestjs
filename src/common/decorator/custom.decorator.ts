import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger/dist/decorators/api-response.decorator';
import {
  BadRequestErrorDto,
  InternalServerErrorDto,
  NotFoundErrorDto,
  UnauthorizedErrorDto,
} from '../dto/error.dto';
import { PostPutSuccessDto } from '../dto/post-put-success.dto';

/**
 * API Response 시에 공통으로 사용되는 데코레이터
 * @param successDTO 성공시 타입으로 노출할 DTO
 * @constructor
 */
export function CustomApiResponse(successDTO: any) {
  return applyDecorators(
    ApiOkResponse({
      description: '성공',
      type: successDTO,
    }),
    ApiCreatedResponse({
      description: '등록/수정 성공',
      type: PostPutSuccessDto,
    }),
    ApiBadRequestResponse({
      description: '필수값, 타입, 범위 에러',
      type: BadRequestErrorDto,
    }),
    ApiNotFoundResponse({
      description: '찾을 수 없음',
      type: NotFoundErrorDto,
    }),
    ApiUnauthorizedResponse({
      description: '인증 에러',
      type: UnauthorizedErrorDto,
    }),
    ApiInternalServerErrorResponse({
      description: '서버 에러',
      type: InternalServerErrorDto,
    }),
  );
}
