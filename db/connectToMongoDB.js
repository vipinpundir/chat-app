const mongoose = require('mongoose');

connectToMongoDB().catch(err => console.log(err));

async function connectToMongoDB() {
  await mongoose.connect(process.env.MONGO_DB);
  console.log("Connected TO MONGO...")
}

module.exports = connectToMongoDB