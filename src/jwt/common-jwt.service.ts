import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty, throwException } from '../common/util/common.util';
import { PrismaService } from '../prisma.service';
import { Payload } from './passport/payload';
import { JwtRefreshRequestDto } from './dto/jwt-refresh-request.dto';
import { SuccessDto } from '../common/dto/success.dto';

@Injectable()
export class CommonJwtService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  /**
   * JWT Access Token 획득
   * @param payload
   */
  async getAccessToken(payload: Payload): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
  }

  /**
   * JWT Access Token 검사
   * @param accessToken
   */
  validateAccessToken(accessToken: string): boolean {
    if (isEmpty(accessToken))
      throw new BadRequestException('Access Token 은 필수값입니다.');

    try {
      const result = this.jwtService.verify(
        accessToken.replace('Bearer ', ''),
        { secret: process.env.JWT_ACCESS_TOKEN_SECRET },
      ); //result 에는 sign 시 넘겼던 payload 값 들어있음.

      return !isEmpty(result);
    } catch (e) {
      //https://github.com/auth0/node-jsonwebtoken
      switch (e.message) {
        case 'invalid token':
          throw new UnauthorizedException('유효하지 않은 Access Token 입니다.');
        case 'passport expired':
        case 'jwt expired':
          throw new UnauthorizedException('만료된 Access Token 입니다.');
        default:
          throwException(e);
      }
    }
  }

  /**
   * JWT Refresh Token 획득
   * @param login_id
   */
  async getRefreshToken(login_id: string): Promise<string> {
    const token = this.jwtService.sign(
      { login_id },
      {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      },
    );
    const result = await this.prisma.manager.updateMany({
      data: { refresh_token: token },
      where: { login_id },
    });

    if (isEmpty(result)) {
      throw new InternalServerErrorException(
        'Refresh Token 업데이트를 실패했습니다.',
      );
    }

    return token;
  }

  /**
   * JWT Refresh Token 검사
   * @param refresh_token
   * @param login_id
   */
  validateRefreshToken(
    refresh_token: string,
    login_id: string,
  ): boolean | null {
    if (isEmpty(refresh_token))
      throw new BadRequestException('Refresh Token은 필수값입니다.');
    else if (isEmpty(login_id))
      throw new BadRequestException('ID는 필수값입니다.');

    try {
      const result = this.jwtService.verify(
        refresh_token.replace('Bearer ', ''),
        { secret: process.env.JWT_REFRESH_TOKEN_SECRET },
      ); //result 에는 sign 시 넘겼던 payload 값 들어있음.

      return !isEmpty(result);
    } catch (e) {
      //https://github.com/auth0/node-jsonwebtoken
      switch (e.message) {
        case 'invalid token':
          throw new UnauthorizedException('유효하지 않은 Refresh Token입니다.');
        case 'passport expired':
        case 'jwt expired':
          throw new UnauthorizedException('만료된 Refresh Token입니다.');
        default:
          throwException(e);
      }
    }
  }

  /**
   * JWT 토큰 재발급
   * @param jwtRefreshRequestDto
   */
  async tokenRefresh(
    jwtRefreshRequestDto: JwtRefreshRequestDto,
  ): Promise<SuccessDto> {
    const { refresh_token, login_id } = jwtRefreshRequestDto;
    const validateRefreshToken = this.validateRefreshToken(
      refresh_token,
      login_id,
    );

    if (!validateRefreshToken) {
      throw new UnauthorizedException('유효하지 않은 Refresh Token입니다.');
    }

    const result = await this.prisma.manager.findFirst({
      select: {
        login_id: true,
        manager_id: true,
        manager_name: true,
        refresh_token: true,
        authority: true,
      },
      where: { login_id },
    });

    if (isEmpty(result)) {
      throw new UnauthorizedException('계정이 존재하지 않습니다');
    } else if (result.refresh_token !== refresh_token) {
      throw new UnauthorizedException(
        '계정과 Refresh Token 이 일치하지 않습니다.',
      );
    }

    return new SuccessDto({
      access_token: await this.getAccessToken({
        sn: result.login_id,
        id: result.manager_id,
        name: result.manager_name,
      }),
      refresh_token: await this.getRefreshToken(result.login_id),
    });
  }

  /**
   * JWT Refresh 토큰 삭제
   * @param login_id
   */
  async removeRefreshToken(login_id: string): Promise<boolean> {
    const result = await this.prisma.manager.updateMany({
      data: { refresh_token: null },
      where: { login_id },
    });

    return !isEmpty(result);
  }

  /**
   * payload 검사
   * @param payload
   */
  async checkPayload(payload): Promise<boolean> {
    const { sub, manager_id } = payload;
    const result = await this.prisma.manager.findFirst({
      where: { login_id: sub, manager_id },
    });

    return isEmpty(result);
  }

  /**
   * payload 추출
   * @param accessToken
   */
  getPayload(accessToken: string): any {
    try {
      if (isEmpty(accessToken))
        throw new UnauthorizedException('유효하지 않은 Access Token 입니다.');

      return this.jwtService.decode(accessToken.replace('Bearer ', ''));
    } catch (e) {
      throwException(e);
    }
  }
}
