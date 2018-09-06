import fetch from "node-fetch";
import Redis = require("ioredis");
import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { createTypeormConn } from "./createTypeOrmConnections";
import { User } from "../entity/User";

let userId: string;
const redis = new Redis();
beforeAll(async () => {
  await createTypeormConn();
  const user = await User.create({
    email: "apple@hello.com",
    password: "123123123"
  }).save();
  userId = user.id;
});

describe("test createConfirmEmailLink", async () => {
  test("Make sure it confirms user and clears key in redis", async () => {
    const url = await createConfirmEmailLink(
      process.env.TEST_HOST as string,
      userId,
      redis
    );

    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual("ok");
    const user: User = (await User.findOne({
      where: { id: userId }
    })) as User;
    expect(user.confirmed).toBeTruthy();
    const chunks = url.split("/");
    const key = chunks[chunks.length - 1];
    const value = await redis.get(key);
    expect(value).toBeNull()
  });

  test("sends invalid back if bad id sent", async () => {
    const response = await fetch(`${process.env.TEST_HOST}/confirm/12332`);
    const text = await response.text();
    expect(text).toEqual("invalid");
  });
});
