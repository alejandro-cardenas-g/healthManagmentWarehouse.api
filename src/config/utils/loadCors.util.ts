const defaultDev = [
  /\/[0-9]+.[0-9]+.[0-9]+.[0-9]+\:[0-9]+/,
  /\localhost\:[0-9]+/,
];

export const loadCorsStrategy = (hosts: string | undefined) => {
  const CORS_ORIGINS: string | string[] | RegExp[] =
    hosts?.split(',') || defaultDev;
  return CORS_ORIGINS;
};
