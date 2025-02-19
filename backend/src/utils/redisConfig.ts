import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT),
  },
  username: process.env.REDIS_USERNAME as string,
  password: process.env.REDIS_PASSWORD as string,
});

redisClient.connect().catch(console.error);
