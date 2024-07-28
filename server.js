require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const http = require('http');

const NYTimesBooksAPI = require('./dataSources/nyTimesAPI');
const GoogleBooksAPI = require('./dataSources/googleBooksAPI');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');

const port = process.env.PORT || 9000;

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB`);
  } catch (err) {
    console.error(err);
  }
};

connectToMongoDB();

const startApolloServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(
    cors({
      origin: 'https://page-master-app.vercel.app',
      credentials: true,
    }),
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use('/graphql', express.json(), expressMiddleware(server));

  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  console.log(`Server running on http://localhost:${port}/graphql`);
};

startApolloServer();
