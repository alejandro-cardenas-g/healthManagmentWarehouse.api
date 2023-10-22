import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../interfaces';
import { ISecrets } from '../interfaces/secrets.interface';
import { UserAuthRepository } from '../repositories';

@Injectable()
export class TokenService {
  public static readonly secretAccessEnv = 'secrets.accessToken';
  public static readonly secretRefreshEnv = 'secrets.refreshToken';

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserAuthRepository,
  ) {}

  getAccessToken(payload: IJwtPayload) {
    const { privateKey } = this.configService.getOrThrow<ISecrets>(
      TokenService.secretAccessEnv,
    );
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey,
      expiresIn: '15d',
    });
  }

  validateAccessToken(accessToken: string) {
    const { publicKey } = this.configService.getOrThrow<ISecrets>(
      TokenService.secretAccessEnv,
    );
    return this.jwtService.verify<IJwtPayload>(accessToken, {
      algorithms: ['RS256'],
      publicKey,
    });
  }

  getRefreshToken(payload: IJwtPayload) {
    const { privateKey } = this.configService.getOrThrow<ISecrets>(
      TokenService.secretRefreshEnv,
    );
    return this.jwtService.sign(payload, {
      expiresIn: '2d',
      algorithm: 'RS256',
      privateKey,
    });
  }

  validateRefreshToken(refreshToken: string) {
    const { publicKey } = this.configService.getOrThrow<ISecrets>(
      TokenService.secretRefreshEnv,
    );
    return this.jwtService.verify<IJwtPayload>(refreshToken, {
      algorithms: ['RS256'],
      publicKey,
    });
  }

  decodeRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.decode(refreshToken) as IJwtPayload;
      return payload || null;
    } catch {
      return null;
    }
  }

  async revokeRefreshToken(userId: string, restart = false) {
    await this.userRepository.revokeTokenVersion(userId, restart);
    return true;
  }

  getAuthTokens(payload: IJwtPayload) {
    const accessToken = this.getAccessToken(payload);
    const refreshToken = this.getRefreshToken(payload);
    const refreshPayload: any = this.decodeRefreshToken(refreshToken);
    return {
      accessToken,
      refreshToken,
      refreshTokenExpiresAt: new Date(refreshPayload.exp * 1000),
    };
  }
}
