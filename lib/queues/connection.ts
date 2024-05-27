export const redisConnection = {
  username: process.env.REDIS_USERNAME!,
  password: process.env.REDIS_PASSWORD!,
  host: process.env.REDIS_HOST!,
  port: parseInt(process.env.REDIS_PORT!),
  enableOfflineQueue: false,
};
