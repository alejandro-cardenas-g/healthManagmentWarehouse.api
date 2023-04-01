import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Res,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { GetUser } from '../decorators';
import { SignInUserDto } from '../dto';
import { JwtAuthGuard } from '../guards';
import { CookieAuthGuard } from '../guards/cookieAuth.guard';
import { IAuthUser } from '../interfaces';
import { AuthService, UserService } from '../services';
import { userWithPermissionAdapter } from '../utils/adapters/userWithPermissionsAdapter.util';

@Controller('auth')
export class AuthController {
  private cookieName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    this.cookieName = this.configService.getOrThrow<string>('cookieName');
  }

  @Post('sign-in')
  async signIn(
    @Body() signInUserDto: SignInUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, refreshTokenExpiresAt } =
      await this.authService.signIn(signInUserDto);
    this.setRefreshTokenCookie(response, refreshToken, refreshTokenExpiresAt);
    return {
      access_token: accessToken,
    };
  }

  @Get('refresh-token')
  @UseGuards(CookieAuthGuard)
  async refreshToken2(
    @GetUser() user: IAuthUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, refreshTokenExpiresAt } =
      await this.authService.refreshToken(user);
    this.setRefreshTokenCookie(response, refreshToken, refreshTokenExpiresAt);
    return {
      access_token: accessToken,
    };
  }

  @Delete('sign-out')
  @UseGuards(CookieAuthGuard)
  async deleteSession(
    @Res({ passthrough: true }) response: Response,
    @GetUser() user: IAuthUser,
  ) {
    response.clearCookie(this.cookieName);
    this.authService.revokeToken(user, true);
    return;
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@GetUser('id') userId: string) {
    const { user, userPermissions } = await this.userService.getAuthUser(
      userId,
    );
    return userWithPermissionAdapter(user, userPermissions);
  }

  private setRefreshTokenCookie(
    res: Response,
    refreshToken: string,
    refreshTokenExpiresAt: Date,
  ) {
    res.cookie(this.cookieName, refreshToken, {
      httpOnly: true,
      expires: refreshTokenExpiresAt,
    });
  }
}
