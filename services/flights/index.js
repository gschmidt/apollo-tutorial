const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require("@apollo/federation");
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const isEmail = require('isemail');

const LaunchAPI = require('../../datasources/launch')

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    }
  ]),
  dataSources: () => ({
    launchAPI: new LaunchAPI()
  }),
  engine: {
    apiKey: "service:geofftest:iNN-ouAFRHy_ifCg6zOfuQ"
  }
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
