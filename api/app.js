const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const socketService = require("./socketService");
const routes = require("./routes/react");

const app = express();
const server = http.createServer(app); // raw http server
const io = socketio(server); // expect raw http server

app.use(express.json()); // Auto parse json
app.use(express.static(path.join(__dirname, "../build")));
app.use(routes);

io.on("connection", (socket) => socketService(socket, io)); // Fire whenever is socket get a new connection and run one time for each new connection

module.exports = {
    server,
    app
};