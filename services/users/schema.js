const { gql } = require('apollo-server');

const typeDefs = gql`
type User @key(fields: "id") {
  id: ID!
  email: String!
}

extend type Query {
  # The currently logged in user
  me: User
}

extend type Mutation {
  login(email:String): String # login token
}
`;

module.exports = typeDefs;