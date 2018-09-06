import { startServer } from "../startServer";
import { AddressInfo } from "net";

export const setup = async () => {
  // await createTypeormConn();
  const app = await startServer();
  const { port }: AddressInfo = app.address() as AddressInfo;
  process.env.TEST_HOST = `http://127.0.0.1:${port}`;
};
