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

type Launch {
  id: ID!
  site: String
  mission: Mission
  rocket: Rocket
  isBooked: Boolean!
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

enum PatchSize {
  SMALL
  LARGE
}

extend type Mutation {
  bookTrips(launchIds: [ID]!): TripUpdateResponse!
  cancelTrip(launchId: ID!): TripUpdateResponse!
}

type TripUpdateResponse {
  success: Boolean!
  message: String
  launches: [Launch]
}
`;

module.exports = typeDefs;