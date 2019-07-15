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
    async __resolveReference(ref, { dataSources }) {
      return await dataSources.launchAPI.getLaunchById({ launchId: ref.id });
    }
  },
};

module.exports = resolvers;