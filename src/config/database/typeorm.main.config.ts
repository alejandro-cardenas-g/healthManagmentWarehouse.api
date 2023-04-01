import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { resolve } from 'path';
import { DataSource } from 'typeorm';
import {
  DATABASE_ENV_NAMES,
  DB_CONNECTIONS,
  NODE_ENV_NAME,
} from '../constants';

import { config } from 'dotenv';
config();

export const TypeOrmMainConfig: TypeOrmModuleAsyncOptions = {
  name: DB_CONNECTIONS.MAIN,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    const environment = configService.getOrThrow(NODE_ENV_NAME);
    return {
      type: 'postgres',
      host: configService.getOrThrow(DATABASE_ENV_NAMES.DB_HOST),
      port: Number(configService.getOrThrow(DATABASE_ENV_NAMES.DB_PORT)),
      username: configService.getOrThrow(DATABASE_ENV_NAMES.DB_USER),
      password: configService.getOrThrow(DATABASE_ENV_NAMES.DB_PASSWORD),
      database: configService.getOrThrow(DATABASE_ENV_NAMES.DB_NAME),
      entities: [resolve(__dirname + '/../../**/*.entity.{js,ts}')],
      migrations: [resolve(__dirname + '/../../migrations/*{.ts,.js}')],
      synchronize: false,
      autoLoadEntities: false,
      logging: environment === 'production' ? false : true,
    };
  },
};

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(<string>process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [resolve(__dirname + '/../../**/*.entity.{js,ts}')],
  migrations: [resolve(__dirname + '/../../migrations/*{.ts,.js}')],
});
