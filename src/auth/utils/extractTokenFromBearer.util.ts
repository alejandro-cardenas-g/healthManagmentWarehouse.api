import { UnauthorizedException } from '@nestjs/common/exceptions';

export const extractTokenFromBearer = (bearerToken: string): string => {
  const pattern = 'Bearer ';
  if (!bearerToken.startsWith(pattern)) throw new UnauthorizedException();
  const token = bearerToken.split('Bearer ')[1];
  if (!token) throw new UnauthorizedException('Invalid access_token');
  return token;
};
