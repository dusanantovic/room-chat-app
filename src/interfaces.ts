export interface User {
    username: string;
}

export interface RoomData {
    room: string;
    users: User[];
}
 
export interface MessageData {
    createdAt: string;
    username: string;
    text: string;
}

export interface MessageDataLocation {
    createdAt: string;
    username: string;
    url: string;
}