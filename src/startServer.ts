import "reflect-metadata"
import { GraphQLServer } from "graphql-yoga"
import { createTypeormConn } from "./utils/createTypeOrmConnections";
import { redis } from "./redis";
import { confirmEmail } from "./routes/confirmEmail";
import { genSchema } from "./utils/genSchema";
export const startServer = async () => {
  const props: any = {
    schema: genSchema(),
    context: ({ request }: any) => ({
      redis,
      url: `${request.protocol}://${request.get("host")}`
    })
  };
  const server = new GraphQLServer(props);

  server.express.get("/confirm/:id", confirmEmail);
  await createTypeormConn();
  const app = await server.start({
    port: process.env.NODE_ENV === "test" ? 0 : 4000
  });
  console.log("Server is running on localhost:4000");
  return app;
};
