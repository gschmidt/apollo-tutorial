const { ApolloGateway } = require("@apollo/gateway");

const { ApolloServer } = require('apollo-server');

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'flights', url: 'http://localhost:4001' },
    { name: 'users', url: 'http://localhost:4002' },
//    { name: 'reviews', url: 'http://localhost:4003' }
  ]
});

(async () => {
  const { schema, executor } = await gateway.load();
  const server = new ApolloServer({ schema, executor });
  server.listen();
})();