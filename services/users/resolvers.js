const { paginateResults } = require('../../utils');

const resolvers = {
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      console.log("hi");
      console.log(email);
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) {
        const ret = Buffer.from(email).toString('base64');
        console.log(ret);
        return ret;
      }
    }
  },
};

module.exports = resolvers;