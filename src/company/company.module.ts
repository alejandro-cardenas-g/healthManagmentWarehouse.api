import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_CONNECTIONS } from '../config/constants';
import { Company } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Company], DB_CONNECTIONS.MAIN)],
  exports: [TypeOrmModule],
})
export class CompanyModule {}
