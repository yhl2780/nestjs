import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { isEmpty, throwException } from '../common/util/common.util';
import { LoginRequestDto } from './dto/login-request.dto';
import { SuccessDto } from '../common/dto/success.dto';
import { PrismaService } from '../prisma.service';
import { CommonJwtService } from '../jwt/common-jwt.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ExampleService {
  constructor(
    private prisma: PrismaService,
    private commonJwtService: CommonJwtService,
  ) {}

  /**
   * login
   * @param loginRequestDto
   */
  async login(loginRequestDto: LoginRequestDto): Promise<SuccessDto> {
    try {
      const { id, password } = loginRequestDto;
      const result = await this.prisma.user.findFirst({
        where: { id },
      });

      if (isEmpty(result)) {
        throw new UnauthorizedException('계정이 존재하지 않습니다.');
      }

      const validatePassword = await bcrypt.compare(password, result.password);
      if (!validatePassword) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }

      return new SuccessDto({
        access_token: await this.commonJwtService.getAccessToken({
          sn: result.sn,
          id: result.id,
          name: result.name,
          침ㄴㄴ,
        }),
        refresh_token: await this.commonJwtService.getRefreshToken(result.id),
      });
    } catch (e) {
      throwException(e);
    }
  }

  /**
   * logout
   * @param id
   */
  async logout(id: string): Promise<SuccessDto> {
    try {
      const result = await this.commonJwtService.removeRefreshToken(id);

      if (isEmpty(result)) {
        throw new InternalServerErrorException(
          'Refresh Token 삭제를 실패했습니다.',
        );
      }

      return new SuccessDto();
    } catch (e) {
      throwException(e);
    }
  }
}
