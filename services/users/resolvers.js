const { paginateResults } = require('../../utils');

const resolvers = {
  Query: {
    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) {
        const ret = Buffer.from(email).toString('base64');
        return ret;
      }
    }
  },
  User: {
    async __resolveReference(ref, { dataSources }) {
      return await dataSources.userAPI.findUserById(ref.id);
    },
  }
};

module.exports = resolvers;