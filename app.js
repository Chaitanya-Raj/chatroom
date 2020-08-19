var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

var server = require("http").Server(app);
var io = require("socket.io")(server);

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/client/build")));

io.sockets.on("connection", (socket) => {
  socket.on("username", (username) => {
    socket.username = username;
    console.log(`User connected: ${socket.username}`);
    io.emit("is_online", {
      type: "status",
      user: socket.username,
      action: "joined",
    });
  });

  socket.on("disconnect", (username) => {
    console.log(`${socket.username} Disconnected`);
    io.emit("is_online", {
      type: "status",
      user: socket.username,
      action: "left",
    });
  });

  socket.on("chat_message", (message) => {
    console.log(`${socket.username} : ${message}`);
    io.emit("chat_message", {
      type: "message",
      user: socket.username,
      message,
    });
  });
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
