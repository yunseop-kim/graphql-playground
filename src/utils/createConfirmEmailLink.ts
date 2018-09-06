import { v4 } from "uuid";
import { Redis } from "ioredis";
// http://localhost:4000
// http://my-site.com
// http://my-site.com/confirm/<id>

export const createConfirmEmailLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const id = v4();
  await redis.set(id, userId.toString(), "ex", 60 * 60 * 24);
  return `${url}/confirm/${id}`;
};
