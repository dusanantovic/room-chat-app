const Filter = require("bad-words");
const { generateMessage, generateLocationMessage } = require("./utils/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users");

const socketService = (socket, io) => {

    socket.on("join", (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });
        if (error) {
            return callback(error);
        }
        socket.join(user.room); // Available only on server
        socket.emit("message", generateMessage("Chat App Admin", `Welcome ${user.username}!`));
        socket.broadcast.to(user.room).emit("message", generateMessage(user.username, `${user.username} has joined!`));
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
        callback();
    });

    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter();
        if(filter.isProfane(message)){
            return callback("Profanity is not allowed!");
        }
        const user = getUser(socket.id);
        if(user) {
            io.to(user.room).emit("message", generateMessage(user.username, message));
            callback();
        }
    });

    socket.on("sendLocation", (data, callback) => {
        const user = getUser(socket.id);
        if(user) {
            io.emit("locationUrl", generateLocationMessage(user.username, `https://google.com/maps?q=${data.lat},${data.lng}`));
            callback();
        }
    });

    const disconnectUser = (username = "", room = "") => {
        let user = removeUser(socket.id);
        if(username && room) {
            const users = getUsersInRoom(room);
            const userFromRoom = users.find(u => u === username.trim().toLowerCase());
            user = userFromRoom || user;
        }
        if(user) {
            io.to(user.room).emit("message", generateMessage("Chat App Admin", `${user.username} has left!`));
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    }

    socket.on("disconnect", () => disconnectUser());

    socket.on("logout", (data, callback) => {
        disconnectUser(data.username, data.room);
        callback();
    });

}

module.exports = socketService;