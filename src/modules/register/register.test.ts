import { request } from "graphql-request";
import { startServer } from "../../startServer";
import { User } from "../../entity/User";
import { passwordNotLongEnough } from "./errorMessage";
// tslint:disable-next-line:no-duplicate-imports
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail
} from "./errorMessage";
let getHost = () => "";

beforeAll(async () => {
  // await createTypeormConn();
  const app = await startServer();
  const { port }: any = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = "myname@name.com";
const password = "123456";
const mutation = (e: string, p: string) => `
mutation {
    register(email: "${e}", password:"${p}") {
      path
      message
    }
}`;
test("Register user", async () => {
  // make sure we can register user.
  const response = await request(getHost(), mutation(email, password));
  expect(response).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);

  // test for duplicate emails
  const response2: any = await request(getHost(), mutation(email, password));
  expect(response2.register).toHaveLength(1);
  expect(response2.register[0]).toEqual({
    path: "email",
    message: duplicateEmail
  });

  // catch bad email
  const response3: any = await request(getHost(), mutation("b", password));
  expect(response3).toEqual({
    register: [
      {
        path: "email",
        message: emailNotLongEnough
      },
      {
        path: "email",
        message: invalidEmail
      }
    ]
  });

  // catch bad password
  const response4: any = await request(getHost(), mutation(email, "ad"));
  expect(response4).toEqual({
    register: [
      {
        path: "password",
        message: passwordNotLongEnough
      }
    ]
  });

  // catch bad password and bad eamil
  const response5: any = await request(getHost(), mutation("bs", "ad"));
  expect(response5).toEqual({
    register: [
      {
        path: "email",
        message: emailNotLongEnough
      },
      {
        path: "email",
        message: invalidEmail
      },
      {
        path: "password",
        message: passwordNotLongEnough
      }
    ]
  });
});
