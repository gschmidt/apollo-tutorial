const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require("@apollo/federation");
const typeDefs = require('./schema');
const { createStore } = require('../../utils');
const resolvers = require('./resolvers');
const isEmail = require('isemail');

const UserAPI = require('../../datasources/user');

const store = createStore('../../store.sqlite');

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    }
  ]),
  dataSources: () => ({
    userAPI: new UserAPI({ store })
  }),
  engine: {
    apiKey: "service:geofftest:iNN-ouAFRHy_ifCg6zOfuQ"
  },
  context: async ({ req }) => {
    if (! req.headers['user-id'])
      return { user: null };
    console.log(JSON.stringify(req.headers['user-id']));
    const id = parseInt(req.headers['user-id']);
    console.log(JSON.stringify(id));
    const users = await store.users.findOrCreate({ where: { id }});
    const user = users && users[0] ? users[0] : null;
    console.log(user);
    return { user: { ...user.dataValues } };
  }
});

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
