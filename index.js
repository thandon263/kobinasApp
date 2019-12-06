const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dotenv = require('dotenv');

// Access the environment variables
dotenv.config();

const url = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017';
const dbName = 'authentication';

// Import DB Service
const { remoteMongoAtlasDatabase } = require('./database/databaseService/mongoDb'); 

// Import Routes
const authRoute = require('./Services/authenticationService/index');

// Connecting to the mongo service
// MongoClientService(MongoClient, url, dbName);
remoteMongoAtlasDatabase(url)

// Middleware
app.use(express.json());

// Routes Middlewares
app.get('/', (req, res, next) => {
    res.send("Hello world");
});

app.use('/api/auth', authRoute);

app.listen(PORT, () => process.stdout.write(`\nServer up and running on port: ${PORT} \n`));