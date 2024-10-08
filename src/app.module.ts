import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Secrets } from './auth/constants';
import { CommonModule } from './common/common.module';
import { CompanyModule } from './company/company.module';
import { TypeOrmMainConfig } from './config/database/typeorm.main.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Secrets],
    }),
    TypeOrmModule.forRootAsync(TypeOrmMainConfig),
    AuthModule,
    CommonModule,
    CompanyModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
