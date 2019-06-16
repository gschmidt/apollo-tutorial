const { gql } = require('apollo-server');

const typeDefs = gql`
type Query {
  hello(name: String!): String
}
`;

module.exports = typeDefs;