import { startServer } from "../startServer";

export const setup = async () => {
  // await createTypeormConn();
  const app = await startServer();
  const { port }: any = app.address();
  process.env.TEST_HOST = `http://127.0.0.1:${port}`;
};
