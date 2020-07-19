import React from "react";
import moment from "moment";
import { User, MessageData, MessageDataLocation } from "./interfaces";

const ChatStateContext = React.createContext({
   socket: null as SocketIOClient.Socket | null,
   room: "",
   username: "",
   users: [] as User[],
   messageData: [] as MessageData[],
   setLoginData: (e: any) => {},
   setRoomData: (room: string, users: User[]) => {},
   setMessageData: (data: MessageData) => {},
   setLocationData: (data: MessageDataLocation) => {},
   logout: (redirect: boolean) => {}
});

const getFormatedTime = (createdAt: number) => moment(createdAt).format("h:mm A");
const autoScroll = () => {
   // New message element
   const messagesContainer = document.querySelector("#messagesContainer") as any;
   if(messagesContainer) {
      const newMessage = messagesContainer.lastElementChild as any;
      // Heihgt of the new message
      if(newMessage) {
         const newMessageStyles = getComputedStyle(newMessage);
         const newMessageMargin = (
            parseInt(newMessageStyles.marginTop) +
            parseInt(newMessageStyles.marginBottom) +
            parseInt(newMessageStyles.paddingTop) +
            parseInt(newMessageStyles.paddingBottom) +
            parseInt(newMessageStyles.lineHeight)
         );
         const newMessageHeight = newMessage.offsetHeight + newMessageMargin;
         // Visible screen
         const visibleHeight = messagesContainer.offsetHeight;
         // Height of messages container
         const containerHeight = messagesContainer.scrollHeight;
         // How far have I scrolled?
         const scrollOffSet = messagesContainer.scrollTop + visibleHeight;
         if ((containerHeight - newMessageHeight) <= scrollOffSet) {
            messagesContainer.scrollTop = containerHeight;
         }
      }
   }
}

export const ChatManager = {
   ChatStateContext,
   getFormatedTime,
   autoScroll,
};