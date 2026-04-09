const mongoose = require("mongoose");

async function connectMongo(mongodbUri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongodbUri);
  return mongoose.connection;
}

module.exports = { connectMongo };

