const { paginateResults } = require('../../utils');

const resolvers = {
  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id })
  },
  User: {
    trips: async (_, __, { dataSources }) => {
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();
      return ret = launchIds.map((id) => ({ __typename: "Launch", id }));
    }
  },
  Mutation: {
    bookTrips: async (_, { launchIds }, { dataSources }) => {
      const results = await dataSources.userAPI.bookTrips({ launchIds });
      return {
        success: results && results.length === launchIds.length,
        message:
          results.length === launchIds.length
            ? 'trips booked successfully'
            : `the following launches couldn't be booked: ${launchIds.filter(
                id => !results.includes(id),
              )}`,
        launches: launchIds.map((id) => ({ __typename: "Launch", id }))
      }
    },
    cancelTrip: async (_, { launchId }, { dataSources }) => {
      const result = await dataSources.userAPI.cancelTrip({ launchId });
  
      if (!result)
        return {
          success: false,
          message: 'failed to cancel trip',
        };
  
      return {
        success: true,
        message: 'trip cancelled',
        launches: [{ __typename: "Launch", id: launchId }],
      };
    },
  }
};

module.exports = resolvers;