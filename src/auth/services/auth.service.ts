import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { SignInUserDto } from '../dto';
import { IAuthUser, IJwtPayload } from '../interfaces';
import { UserRepository } from '../repositories';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private invalidAccessToken = 'Invalid access_token';

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async signIn(
    signInUserDto: SignInUserDto = {
      email: 'admin@admin.com',
      password: 'password',
    },
  ) {
    const { email, password } = signInUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user)
      throw new UnauthorizedException('Credenciales inválidas (Email)');
    const passwordValidation = compareSync(password, user.password);
    if (!passwordValidation)
      throw new UnauthorizedException('Credenciales inválidas (Contraseña)');
    if (!user.isActive)
      throw new ForbiddenException('El usuario no está activo');
    return this.tokenService.getAuthTokens({
      companyId: user.companyId,
      id: user.id,
      tokenVersion: user.tokenVersion,
    });
  }

  async refreshToken(user: IAuthUser) {
    return this.tokenService.getAuthTokens({
      id: user.id,
      companyId: user.companyId,
      tokenVersion: user.tokenVersion,
    });
  }

  async revokeToken(user: IAuthUser, restart = false) {
    return this.tokenService.revokeRefreshToken(user.id, restart);
  }
}
