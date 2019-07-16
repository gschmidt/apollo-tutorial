const { gql } = require('apollo-server');

const typeDefs = gql`
extend type Query {
  hello(name: String!): String
  launches(
    """The number of results to return. Minimum 1, maximum 20."""
    pageSize: Int
    """Return results after this cursor"""
    after: String
  ): LaunchConnection!
  launch(id: ID!): Launch
}

"""Paginated list of Launches"""
type LaunchConnection {
  cursor: String!
  hasMore: Boolean!
  launches: [Launch]!
}

type Launch @key(fields: "id") {
  id: ID!
  site: String
  mission: Mission
  rocket: Rocket
}

type Rocket {
  id: ID!
  name: String
  type: String
}

type Mission {
  name: String
  missionPatch(size: PatchSize): String
}

# Possible mission patch sizes
enum PatchSize {
  SMALL
  LARGE
}
`;

module.exports = typeDefs;