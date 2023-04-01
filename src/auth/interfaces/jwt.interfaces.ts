import { User } from '../entities';

export interface IJwtPayload {
  id: string;
  companyId: number;
  tokenVersion: number;
}

export type IAuthUser = User & { permissions: string[] };
