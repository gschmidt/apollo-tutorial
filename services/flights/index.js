const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require("@apollo/federation");
const typeDefs = require('./schema');
const { createStore } = require('../../utils');
const resolvers = require('./resolvers');
const isEmail = require('isemail');

const LaunchAPI = require('../../datasources/launch')
const UserAPI = require('../../datasources/user')

const store = createStore('../../store.sqlite');

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    }
  ]),
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store })
  }),
  engine: {
    apiKey: "service:geofftest:iNN-ouAFRHy_ifCg6zOfuQ"
  },
  context: async ({ req }) => {
    const auth = (req.headers && req.headers.authorization) || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    if (! isEmail.validate(email)) return { user: null };
    const users = await store.users.findOrCreate({ where: { email }});
    const user = users && users[0] ? users[0] : null;
    return { user: { ...user.dataValues } };
  }
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
