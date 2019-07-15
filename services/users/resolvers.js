const { paginateResults } = require('../../utils');

const resolvers = {
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) return Buffer.from(email).toString('base64');
    }
  },
};

module.exports = resolvers;