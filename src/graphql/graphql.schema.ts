import gql from "graphql-tag";

export const typeDefs = gql`
type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    createdAt: String!
    updatedAt: String!
}
type CreateUserPayload {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
}
input CreateUserInput {
    name: String!
    email: String!
    password: String!
}
input UpdateUserInput {
    name: String
    email: String
    password: String
    UpdatedAt: String
}

type Query {
    getUser(email: String!): User
    getUsers: [User!]
    getUserByID(id: ID!): User
}

type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
    ): CreateUserPayload!
    updateUser(
      name: String
      email: String
      password: String
    ): User!
    deleteUser(email: String!): User
    authenticateUser (
      email: String!
      password: String!
    ): User
}  
`;