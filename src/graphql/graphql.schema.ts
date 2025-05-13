import gql from "graphql-tag";

export const typeDefs = gql`
scalar Upload
scalar GraphQLDate

type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    createdAt: GraphQLDate!
    updatedAt: GraphQLDate!
}
type CreateUserPayload {
    id: ID!
    name: String!
    email: String!
    createdAt: GraphQLDate!
    updatedAt: GraphQLDate!
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
    UpdatedAt: GraphQLDate
}
enum Status {
  NEW
  SCHEDULED
  ONGOING
  SELECTED
  REJECTED
}
enum Position {
  DESIGNER
  DEVELOPER
  HUMAN_RESOURCE
}
type Candidate {
  id: ID!
  name: String!
  email: String!
  countryCode: String!
  phone: String!
  position: String!
  Department: String!
  DateOfJoining: GraphQLDate
  status: Status
  experience: Int
  createdAt: GraphQLDate!
  updatedAt: GraphQLDate!
  image: String
  hrManager: User!
}

type Query {
    getUser(email: String!): User
    getUsers: [User!]
    getUserByID(id: ID!): User
    getCandidatesByHR(hrManagerId: ID!, status: Status, position: Position): [Candidate!]!
    getCandidateByID(id: ID!, hrManagerId: ID!): Candidate
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

  createCandidate(
    name: String!
    email: String!
    countryCode: String!
    phone: String!
    position: String!
    Department: String!
    DateOfJoining: GraphQLDate
    status: Status
    experience: Int
    image: String
    hrManagerId: ID!
  ): Candidate
  
  updateCandidate(
    id: ID!
    name: String
    email: String
    countryCode: String
    phone: String
    position: String
    Department: String
    DateOfJoining: GraphQLDate
    status: Status
    experience: Int
    image: String
    hrManagerId: ID!
  ): Candidate
  
  deleteCandidate(id: ID!, hrManagerId: ID!): Boolean

  updateCandidateWithResume(
    id: ID!
    resume: Upload!
    hrManagerId: ID!
  ): Candidate
}  
`;