import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExampleService } from './example.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PostPutSuccessDto } from '../common/dto/post-put-success.dto';
import { SuccessDto } from '../common/dto/success.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { CustomApiResponse } from '../common/decorator/custom.decorator';
import { SwaggerLoginResponse } from './dto/swagger-login-response.dto';

@ApiBearerAuth('authorization')
@ApiSecurity('api-key')
@ApiTags('Example API')
@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post('/login')
  @ApiOperation({
    summary: '로그인',
    description:
      '관리자 로그인 처리를 위해 Access Token 과 Refresh Token 을 발급합니다.',
  })
  @ApiBody({ type: LoginRequestDto })
  @CustomApiResponse(SwaggerLoginResponse)
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<SuccessDto> {
    return await this.exampleService.login(loginRequestDto);
  }

  @Get('/logout/:id')
  @ApiOperation({
    summary: '로그아웃',
    description:
      '관리자 로그아웃 처리를 위해 Refresh Token 을 삭제합니다.<br>토큰 자체는 expiration time 까지 유효합니다.',
  })
  @CustomApiResponse(PostPutSuccessDto)
  //@ApiConsumes('multipart/form-data')
  async logout(@Param('id') id: string): Promise<SuccessDto> {
    return await this.exampleService.logout(id);
  }
}
