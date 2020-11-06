const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const MONGO_CONNECTION = require("./db/db");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 4000;
const http = require("http");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
const contextMiddleware = require("./auth/auth-check");
/**
 *  ======================
 *   CREATE APOLLO SERVER
 *  ======================
 */
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
  subscriptions: { path: "/" },
});
const app = express();
server.applyMiddleware({ app });
app.use(cors());
app.use(express.static("media"));
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.listen(port, () => {
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
  );
  /**
   *  ======================
   *    Connect to MongoDB
   *  ======================
   *
   *  ======================
   *    ./db/db.js
   *  ======================
   */
  mongoose
    .connect(
      MONGO_CONNECTION,
      { useNewUrlParser: true },
      { useUnifiedTopology: true }
    )
    .then(() => {
      /**
       *  =================================
       *   succesfully connected to mongoDB
       *  =================================
       */
      console.log("Connected 🚀 To MongoDB Successfully");
    });
});
