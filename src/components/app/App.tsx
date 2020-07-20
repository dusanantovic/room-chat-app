import React from "react";
import io from "socket.io-client";
import { createHashHistory } from "history";
import { Routes } from "../Routes";
import { MessageData, MessageDataLocation, User, RoomData, Typing } from "../../interfaces";
import { ChatManager } from "../../chat";
import { config } from "../../config";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "../../theme";

export const history = createHashHistory();

interface ComponentState {
   socket: SocketIOClient.Socket | null;
   room: string;
   username: string;
   users: User[];
   messageData: MessageData[];
   typing: Typing[];
}

class Component extends React.Component<{}, ComponentState> {

   constructor() {
      super({});
      this.state = {
         socket: null,
         room: localStorage.getItem("room") || "",
         username: localStorage.getItem("username") || "",
         users: [],
         messageData: [],
         typing: []
      };
   }

   setLoginData(e: any) {
      this.setState({ ...this.state, [e.target.name]: e.target.value });
   }

   join() {
      const { socket, room, username } = this.state;
      const storageUsername = localStorage.getItem("username") || username;
      const storageRoom = localStorage.getItem("room") || room
      if(storageUsername && storageRoom) {
         socket!.emit("join", { username: storageUsername, room: storageRoom }, (error: string) => {
            if (error) {
               alert(error);
               return history.push("/");
            }
         });
      } else {
         return history.push("/");
      }
   }

   componentDidMount() {
      if(config) {
         const socket = io(config.apiUrl);
         socket.on("connect", () => {
            console.log("Connected!");
            this.setState({ socket });
         });
         socket.on("logout", () => {
            this.setState({ messageData: [] });
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
         socket.on("typing", ({ username, typing }: Typing) => {
            if (typing) {
               this.setState({ typing: [...this.state.typing, { username, typing }] });
            } else {
               const typingData = this.state.typing;
               const stopTypingIndex = typingData.findIndex(t => t.username === username);
               if(stopTypingIndex > -1) {
                  typingData.splice(stopTypingIndex, 1);
                  this.setState({ typing: typingData });
               }
            }
         });
      }
   }

   setRoomData(room: string, users: User[]) {
      this.setState({ room, users });
   }

   logout(redirect: boolean) {
      const { socket, username, room } = this.state;
      if(socket) {
         socket.emit("logout", { username, room }, () => {
            this.cleraMessageData();
            localStorage.removeItem("username");
            localStorage.removeItem("room");
            console.log("Logout!");
            if (redirect) {
               history.push("/");
            }
         });
      } else {
         history.push("/");
      }
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

   cleraMessageData() {
      this.setState({ messageData: [] });
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
               setLocationData: (data) => this.setLocationData(data),
               join: () => this.join(),
               logout: (redirect) => this.logout(redirect)
            }}
         >
            <MuiThemeProvider theme={theme}>
               <Routes />
            </MuiThemeProvider>
         </ChatManager.ChatStateContext.Provider>
      );
   }
}

export const App = Component;