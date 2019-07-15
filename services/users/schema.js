const { gql } = require('apollo-server');

const typeDefs = gql`
type User {
  id: ID!
  email: String!
#  trips: [Launch]! # XXX
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