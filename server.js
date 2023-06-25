require('dotenv').config();
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");

const NYTimesBooksAPI = require("./dataSources/nyTimesAPI");
const GoogleBooksAPI = require("./dataSources/googleBooksAPI");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");

const port = process.env.PORT || 9000;

const connectToMongoDB = async () => {
  const db = await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(`Connected to MongoDB`);
    })
    .catch((err) => {
      console.log(err);
    });
};

connectToMongoDB();

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    cors: true,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async () => {
      const { cache } = server;

      return {
        dataSources: {
          nyTimesBooksAPI: new NYTimesBooksAPI({ cache }),
          googleBooksAPI: new GoogleBooksAPI({ cache }),
        },
      };
    },
  });

  console.log(`Server running on ${url}`);
};

startApolloServer();
