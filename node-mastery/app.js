require("dotenv").config();
const express = require("express");
const app = express();
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS like HTML code injection
app.use(xss());

// security headers 
const helmet = require("helmet");
app.use(helmet());

// implement rate limiting to all requests
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

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
