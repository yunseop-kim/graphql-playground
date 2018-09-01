import { ResolverMap } from "./types/graphql-utils";
export const resolvers: ResolverMap = {
  Query: {
    hello: (_, { name }) =>
      `Hello ${name || "World"}`
  },
  Mutation: {
    register: (_, { email, password }) => {
      return email + password;
    }
  }
};
