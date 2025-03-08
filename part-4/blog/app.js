const config = require("./utils/config");
const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const morgan = require("morgan");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI);

if (!process.env.NODE_ENV === "test") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
