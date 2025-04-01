const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const userSchema = require('./schemas/userSchema');
const userResolvers = require('./resolvers/userResolver');
const employeeSchema = require('./schemas/employeeSchema');
const employeeResolver = require('./resolvers/employeeResolver');
const cors = require('cors');

require('dotenv').config();
const PORT = process.env.PORT || 4000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(cors({ origin: "http://localhost:4200", credentials: true }));

// Middleware
app.use(express.json());

// Setup Apollo GraphQL Server
const server = new ApolloServer({
    typeDefs: [userSchema, employeeSchema],
    resolvers: [userResolvers, employeeResolver],
    context: ({ req }) => ({ req })
});

// Start Apollo Server
async function startApolloServer() {
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startApolloServer();