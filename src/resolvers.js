const resolvers = {
  Query: {
    hello: (_, { name }, { dataSources }) => `Hello ${name}!`
  }
};

module.exports = resolvers;