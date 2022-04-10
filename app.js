require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const app = express();
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/local_library";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({ secret: "steak" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  if (req.session) {
    res.locals.username = req.session.username;
  }
  next();
});

// routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/catalog", require("./routes/catalog"));

// catch 404 and forward to error handler
app.use(function (_, __, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
