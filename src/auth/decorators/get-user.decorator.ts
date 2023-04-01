import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const { user } = req;
    if (!user)
      throw new InternalServerErrorException('User not found (request)');
    if (!data) return user;
    if (!Object.keys(user).includes(data))
      throw new InternalServerErrorException(
        `Given property not found in user`,
      );
    return user[data];
  },
);
