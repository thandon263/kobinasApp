const mongoose = require('mongoose')
const { MongoClient } = require('mongodb')

function MongoClientService(mongoClient, url, dbName) {
  return MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err)
  
    // Storing a reference to the database so you can use it later
    let databaseClient = client.db(dbName)
  
    console.log(`Connected MongoDB: ${url}`)
    console.log(`Database: ${dbName}`)

    return databaseClient;

  })
}

function OnlineMongoClient(connectionString) {
  return mongoose.connect(
    connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to DB!')
  );
}

module.exports = {
  localDB: MongoClientService,
  remoteMongoAtlasDatabase: OnlineMongoClient
}