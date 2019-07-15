const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const { ApolloServer } = require('apollo-server');

const isEmail = require('isemail');
const { createStore } = require('../utils');

const store = createStore("../store.sqlite");

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'flights', url: 'http://localhost:4001' },
    { name: 'users', url: 'http://localhost:4002' },
//    { name: 'reviews', url: 'http://localhost:4003' }
  ],
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        if (context.user) {
          console.log(context.user.id);
          request.http.headers.set('user-id', context.user.id)
        }
      }
    })
  }
});

(async () => {
  const { schema, executor } = await gateway.load();
  const server = new ApolloServer({
    schema,
    executor,
    context: async ({ req }) => {
      const auth = (req.headers && req.headers.authorization) || '';
      const email = Buffer.from(auth, 'base64').toString('ascii');
      if (! isEmail.validate(email)) return { user: null };
      console.log(email);
      console.log("before");
      const users = await store.users.findOrCreate({ where: { email }});
      console.log("after");
      const user = users && users[0] ? users[0] : null;
      return { user: { ...user.dataValues } };
    }
  });
  server.listen();
})();