import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAuthUser, IJwtPayload } from '../interfaces';
import { PermissionRepository, UserAuthRepository } from '../repositories';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userRepository: UserAuthRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>(
        `${TokenService.secretAccessEnv}.publicKey`,
      ),
      ignoreExpiration: false,
    });
  }

  async validate(payload: IJwtPayload): Promise<IAuthUser> {
    const { id } = payload;
    if (!id) throw new UnauthorizedException('Invalid access_token');
    const [user, permissions] = await Promise.all([
      this.userRepository.getAuthInfo(id),
      this.permissionRepository.getUserPermissions(id),
    ]);
    if (!user) throw new UnauthorizedException('Invalid access_token');
    if (!user.isActive)
      throw new UnauthorizedException('El usuario no está activo');
    return { ...user, permissions: permissions.map((p) => p.name) };
  }
}
