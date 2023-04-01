export const ALLOWED_HOST: string | undefined = process.env.ALLOWED_HOST;
export const CORS_ORIGINS: string | string[] = ALLOWED_HOST?.split(',') || '*';
export const NODE_ENV_NAME = 'NODE_ENV';
