import { v4 } from "uuid";
import { Redis } from "ioredis";
import { ObjectID } from "typeorm";
// http://localhost:4000
// http://my-site.com
// http://my-site.com/confirm/<id>

export const createConfirmEmailLink = (
  url: string,
  userId: ObjectID,
  redis: Redis
) => {
  const id = v4();
  redis.set(id, userId, "ex", 60 * 60 * 24);
  return `${url}/confirm/${id}`;
};
