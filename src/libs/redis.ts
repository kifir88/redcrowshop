import Redis from "ioredis";

declare global {
    // Prevent multiple instances in dev hot-reload
    // eslint-disable-next-line no-var
    var redis: Redis | undefined;
}

const redis =
    global.redis ||
    new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
    });

if (process.env.NODE_ENV !== "production") global.redis = redis;

export default redis;