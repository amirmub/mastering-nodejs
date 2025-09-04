const mongoose = require("mongoose");

 const dbConnection =  async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`✅ DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = dbConnection