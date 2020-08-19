var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var logger = require("morgan");

var app = express();

var server = require("http").Server(app);
var io = require("socket.io")(server);

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "/client/build")));

io.sockets.on("connection", (socket) => {
  socket.on("username", (username) => {
    socket.username = username;
    // console.log(`User connected: ${socket.username}`);
    io.emit("is_online", {
      type: "status",
      user: socket.username,
      action: "joined",
    });
  });

  socket.on("disconnect", (username) => {
    // console.log(`${socket.username} Disconnected`);
    if (socket.username !== undefined)
      io.emit("is_online", {
        type: "status",
        user: socket.username,
        action: "left",
      });
  });

  socket.on("chat_message", (message) => {
    // console.log(`${socket.username} : ${message}`);
    io.emit("chat_message", {
      type: "message",
      user: socket.username,
      message,
    });
  });
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Static file declaration
app.use(express.static(path.join(__dirname, "client/build")));

//production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendfile(path.join((__dirname = "client/build/index.html")));
  });
}

//build mode
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/public/index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = { app, server };
