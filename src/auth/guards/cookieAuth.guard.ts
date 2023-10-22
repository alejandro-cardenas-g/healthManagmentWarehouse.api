import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { IAuthUser } from '../interfaces';
import { UserAuthRepository } from '../repositories';
import { TokenService } from '../services/token.service';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  private cookieName: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserAuthRepository,
  ) {
    this.cookieName = this.configService.getOrThrow<string>('cookieName');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const refreshToken = req?.cookies?.[this.cookieName];
    if (!refreshToken) throw new UnauthorizedException('');

    try {
      const payload = this.tokenService.validateRefreshToken(refreshToken);
      const user = await this.userRepository.getAuthInfo(payload.id);
      if (!user) throw new UnauthorizedException('');
      if (!user.isActive) throw new UnauthorizedException('');
      if (payload.tokenVersion !== user.tokenVersion) {
        throw new UnauthorizedException('');
      }
      const authUser: IAuthUser = {
        ...user,
        permissions: [],
      };
      req.user = authUser;
      return true;
    } catch (e) {
      const payload = this.tokenService.decodeRefreshToken(refreshToken);
      if (payload) await this.tokenService.revokeRefreshToken(payload.id);
      res.clearCookie(this.cookieName);
      throw new UnauthorizedException('Invalid access');
    }
  }
}
