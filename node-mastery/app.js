require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

// db connection file
const dbConnection = require("./config/config");
dbConnection();

// all routes
const routes = require("./routers/index.js");
app.use(routes);

app.listen(5000, (err) => {
  if (err) console.log(err);
  else console.log("its listening PORT http://localhost:5000");
});
