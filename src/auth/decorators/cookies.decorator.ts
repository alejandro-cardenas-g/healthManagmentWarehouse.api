import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const { cookies } = req;
    if (!data) return cookies;
    if (!Object.keys(cookies).includes(data))
      throw new InternalServerErrorException(`Cookie ${data} not found`);
    return cookies[data];
  },
);
