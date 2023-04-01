import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';

import { DB_CONNECTIONS } from '../config/constants';
import {
  AuthController,
  UserController,
  UserPermissionController,
} from './controllers';
import {
  Permission,
  PermissionTemplate,
  User,
  UserPermission,
} from './entities';
import { JwtAuthGuard, PermissionGuard } from './guards';
import {
  PermissionRepository,
  UserPermissionRepository,
  UserRepository,
} from './repositories';
import { AuthService, PermissionService, UserService } from './services';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController, UserController, UserPermissionController],
  providers: [
    JwtAuthGuard,
    PermissionGuard,
    JwtStrategy,
    UserRepository,
    UserPermissionRepository,
    PermissionRepository,
    AuthService,
    UserService,
    PermissionService,
    TokenService,
  ],
  imports: [
    TypeOrmModule.forFeature(
      [User, Permission, UserPermission, PermissionTemplate],
      DB_CONNECTIONS.MAIN,
    ),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  exports: [
    TypeOrmModule,
    PassportModule,
    JwtModule,
    JwtAuthGuard,
    JwtStrategy,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser())
      .forRoutes(
        { path: '/auth/refresh-token', method: RequestMethod.GET },
        { path: '/auth/sign-out', method: RequestMethod.DELETE },
      );
  }
}
