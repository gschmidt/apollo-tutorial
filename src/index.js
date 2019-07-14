const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const LaunchAPI = require('./datasources/launch')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI()
  }),
  engine: {
    apiKey: "service:geofftest:iNN-ouAFRHy_ifCg6zOfuQ"
    }
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
