const config = require("./utils/config");
const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const {unknownEndpoint, errorHandler,tokenExtractor, userExtractor} = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const morgan = require("morgan");
const loginRouter = require("./controllers/login");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

if (!(process.env.NODE_ENV === "test")) {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());
app.use(tokenExtractor);
app.use("/login", loginRouter);
app.use("/api/blogs", userExtractor, blogsRouter);
app.use("/api/users", usersRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
