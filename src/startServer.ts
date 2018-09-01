import "reflect-metadata";
import { importSchema } from "graphql-import";
import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers";
import * as path from 'path';
import { createTypeormConn } from './utils/createTypeOrmConnections';
 
export const startServer = async  () => {
  const typeDefs = importSchema(path.join(__dirname, "./schema.graphql"));
  const server = new GraphQLServer({ typeDefs, resolvers });
  await createTypeormConn();
  const app = await server.start({
    port: process.env.NODE_ENV === 'test' ? 0 : 4000
  });
  console.log("Server is running on localhost:4000");
  return app;
}
