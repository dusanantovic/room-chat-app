import React from "react";
import io from "socket.io-client";
import { createHashHistory } from "history";
import { Routes } from "../Routes";
import { MessageData, MessageDataLocation, User, RoomData } from "../../interfaces";
import { ChatManager } from "../../chat";
import { config } from "../../config";

export const history = createHashHistory();

interface ComponentState {
   socket: SocketIOClient.Socket | null;
   room: string;
   username: string;
   users: User[];
   messageData: MessageData[];
}

class Component extends React.Component<{}, ComponentState> {

   constructor() {
      super({});
      this.state = {
         socket: null,
         room: localStorage.getItem("room") || "",
         username: localStorage.getItem("username") || "",
         users: [],
         messageData: []
      };
   }

   setLoginData(e: any) {
      this.setState({ ...this.state, [e.target.name]: e.target.value });
   }

   componentDidMount() {
      const { room, username } = this.state;
      if(config) {
         const socket = io(config.apiUrl);
         socket.on("connect", () => {
            console.log("Connected!");
            this.setState({ socket }, () => {
               if(room && username) {
                  socket.emit("join", { username, room }, (error: string) => {
                     if (error) {
                        alert(error);
                        return history.push("/");
                     }
                  });
               } else {
                  return history.push("/");
               }
            });
         });
         socket.on("welcomeMessage", (data: MessageData) => {
            this.setState({ messageData: [] });
            this.setMessageData(data);
         });
         socket.on("message", (data: MessageData) => {
            this.setMessageData(data);
         });
         socket.on("locationUrl", (data: MessageDataLocation) => {
            this.setLocationData(data);
         });
         socket.on("roomData", ({ room, users }: RoomData) => {
            this.setRoomData(room, users);
         });
      }
   }

   setRoomData(room: string, users: User[]) {
      this.setState({ room, users });
   }

   setLocationData(data: MessageDataLocation) {
      const { messageData } = this.state;
      messageData.push({
         createdAt: ChatManager.getFormatedTime(data.createdAt as any),
         username: data.username,
         text: data.url
      });
      this.setMessage(messageData);
   }

   setMessageData(data: MessageData) {
      const { messageData } = this.state;
      messageData.push({
         createdAt: ChatManager.getFormatedTime(data.createdAt as any),
         username: data.username,
         text: data.text
      });
      this.setMessage(messageData);
   }

   setMessage(messageData: MessageData[]) {
      this.setState({ messageData });
      ChatManager.autoScroll();
   }

   render() {
      const { socket } = this.state;
      if(!socket) {
         return <React.Fragment />;
      }
      return (
         <ChatManager.ChatStateContext.Provider
            value={{
               ...this.state,
               setLoginData: (e) => this.setLoginData(e),
               setRoomData: (room, users) => this.setRoomData(room, users),
               setMessageData: (data) => this.setMessageData(data),
               setLocationData: (data) => this.setLocationData(data)
            }}
         >
            <Routes />
         </ChatManager.ChatStateContext.Provider>
      );
   }
}

export const App = Component;