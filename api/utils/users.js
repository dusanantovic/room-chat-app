const users = [];

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    // Validate the data
    if(!username || !room) {
        return {
            error: "Username and room are required!",
            user: null
        };
    }
    // Check for existing user
    const isUsernameExistInRoom = users.some(user => user.username === username && user.room === room);
    // Validate username
    if (isUsernameExistInRoom) {
        return {
            error: "Username is in use!",
            user: null
        };
    }
    // Store user
    const user = { id, username, room };
    users.push(user);
    return {
        error: "",
        user
    };
}

const removeUser = (id) => {
    const userIndex = users.findIndex(user => user.id === id);
    if(userIndex > -1) {
        return users.splice(userIndex, 1)[0];
    }
}

const getUser = (id) => users.find(user => user.id === id);

const getUsersInRoom = (room) => users.filter(user => user.room === room);

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};