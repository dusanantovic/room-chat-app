const users = [];

const getTrimAndLowerCaseValue = (value) => value.trim().toLowerCase();

const addUser = ({ id, username, room }) => {
    // Clean the data
    // Validate the data
    if(!getTrimAndLowerCaseValue(username) || !getTrimAndLowerCaseValue(room)) {
        return {
            error: "Username and room are required!",
            user: null
        };
    }
    // Check for existing user
    const isUsernameExistInRoom = users.some(user => 
        getTrimAndLowerCaseValue(user.username) === getTrimAndLowerCaseValue(username) &&
        getTrimAndLowerCaseValue(user.room) === getTrimAndLowerCaseValue(room)
    );
    // Validate username
    if (isUsernameExistInRoom) {
        return {
            error: "Username is in use!",
            user: null
        };
    }
    // Store user
    const existRoomInUsers = users.find(user => getTrimAndLowerCaseValue(user.room) === getTrimAndLowerCaseValue(room));
    const user = {
        id,
        username: username.trim(),
        room: existRoomInUsers ? existRoomInUsers.room : room.trim()
    };
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

const getUsersInRoom = (room) => users.filter(user => getTrimAndLowerCaseValue(user.room) === getTrimAndLowerCaseValue(room));

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};