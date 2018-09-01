import { ResolverMap } from "../../types/graphql-utils";

export const resolvers: ResolverMap = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`
  }
};
