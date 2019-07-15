const { paginateResults } = require('../../utils');


const resolvers = {
  Query: {
    hello: (_, { name }, { dataSources }) => `Hello ${name}!`,
    launches: async (_, {pageSize = 20, after}, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      allLaunches.reverse();
      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches
      });
      const lastLaunch = launches.length ? launches[launches.length - 1] : null;
      return {
        launches,
        cursor: lastLaunch ? lastLaunch.cursor : null,
        hasMore: lastLaunch ? lastLaunch.cursor !== allLaunches[allLaunches.length - 1].cursor
          : false
      };
    },
    launch: (_, { id }, { dataSources }) =>
      dataSources.launchAPI.getLaunchById({ launchId: id })
  },
  Mission: {
    missionPatch: (mission, { size } = { size: "LARGE"}) => {
      return size === "SMALL"
        ? mission.missionPatchSmall
        : mission.missionPatchLarge;
    }
  },
  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id })
  },
  User: {
    trips: async (_, __, { dataSources }) => {
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();
      if (! launchIds.length) return [];
      return dataSources.launchAPI.getLaunchesByIds({ launchIds }) || [];
    }
  },
  Mutation: {
    bookTrips: async (_, { launchIds }, { dataSources }) => {
      const results = await dataSources.userAPI.bookTrips({ launchIds });
      const launches = await dataSources.launchAPI.getLaunchesById(
        { launchIds });
      return {
        success: results && results.length === launchIds.length,
        message:
          results.length === launchIds.length
            ? 'trips booked successfully'
            : `the following launches couldn't be booked: ${launchIds.filter(
                id => !results.includes(id),
              )}`,
        launches
      }
    },
    cancelTrip: async (_, { launchId }, { dataSources }) => {
      const result = await dataSources.userAPI.cancelTrip({ launchId });
  
      if (!result)
        return {
          success: false,
          message: 'failed to cancel trip',
        };
  
      const launch = await dataSources.launchAPI.getLaunchById({ launchId });
      return {
        success: true,
        message: 'trip cancelled',
        launches: [launch],
      };
    },
  }
};

module.exports = resolvers;