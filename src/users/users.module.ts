import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersSearchController } from './controllers/users-search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities';
import { DB_CONNECTIONS } from 'src/config/constants';
import { UserRepository } from './repositories/user.repository';
import { UsersSearchService } from './services/user-search.service';

@Module({
  imports: [TypeOrmModule.forFeature([User], DB_CONNECTIONS.MAIN)],
  controllers: [UsersSearchController],
  providers: [UsersService, UserRepository, UsersSearchService],
})
export class UsersModule {}
