import "reflect-metadata";
import { importSchema } from "graphql-import";
import { GraphQLServer } from "graphql-yoga";
import * as path from "path";
import * as fs from "fs";
import { createTypeormConn } from "./utils/createTypeOrmConnections";
import { mergeSchemas, makeExecutableSchema } from "graphql-tools";
// tslint:disable-next-line:no-implicit-dependencies
import { GraphQLSchema } from "graphql";
import { redis } from "./redis";
import { confirmEmail } from "./routes/confirmEmail";
export const startServer = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, "./modules"));
  folders.forEach(folder => {
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const typeDefs = importSchema(
      path.join(__dirname, `./modules/${folder}/schema.graphql`)
    );
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  });
  const props: any = {
    schema: mergeSchemas({ schemas }),
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
