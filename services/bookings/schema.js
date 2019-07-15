const { gql } = require('apollo-server');

const typeDefs = gql`
extend type Launch @key(fields: "id") {
  id: ID! @external
  isBooked: Boolean!
}

extend type User @key(fields: "id") {
  id: ID! @external
  trips: [Launch]!
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