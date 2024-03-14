import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CommonJwtService } from './common-jwt.service';
import { JwtRefreshRequestDto } from './dto/jwt-refresh-request.dto';
import { SuccessDto } from '../common/dto/success.dto';
import { SwaggerObjectJwtResponseDto } from './dto/swagger-object-jwt-response.dto';
import { CustomApiResponse } from '../common/decorator/custom.decorator';

@ApiSecurity('api-key')
@ApiTags('JWT API')
@Controller('jwt')
export class CommonJwtController {
  constructor(private readonly commonJwtService: CommonJwtService) {}

  @Get('/refresh')
  @ApiOperation({
    summary: 'JWT 토큰 재발급',
    description: 'JWT 토큰을 재발급합니다.',
  })
  @CustomApiResponse(SwaggerObjectJwtResponseDto)
  async validateToken(
    @Query() jwtRefreshRequestDto: JwtRefreshRequestDto,
  ): Promise<SuccessDto> {
    return await this.commonJwtService.tokenRefresh(jwtRefreshRequestDto);
  }
}
