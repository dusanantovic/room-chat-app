import * as React from "react";
import isUrl from "is-url";
import { Sidebar } from "./Sidebar";
import { MessageData } from "../../interfaces";

interface ComponentProps {
    socket: SocketIOClient.Socket;
    messageData: MessageData[];
}

interface ComponentState {
    message: string;
    setTyping: boolean;
}

class Component extends React.Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps){
        super(props);
        this.state = {
            message: "",
            setTyping: false
        };
    }

    sendMessage(e: any) {
        e.preventDefault();
        const { socket } = this.props;
        const { message } = this.state;
        if (!message) {
            return alert("Please enter message");
        }
        const messageForm = document.querySelector("#messageForm") as any;
        const messageFormInput = messageForm.querySelector("input") as any;
        const messageFormButton = messageForm.querySelector("button") as any;
        messageFormButton.setAttribute("disabled", "disabled");
        socket.emit("sendMessage", message, (error: string) => {
            messageFormButton.removeAttribute("disabled");
            this.setState({ message: "" });
            messageFormInput.value = "";
            messageFormInput.focus();
            if(error) {
                return console.log(error);
            }
            console.log("Message delivered!");
        });
    }

    shareLocation() {
        const { socket } = this.props;
        if(!navigator.geolocation) {
            return alert("Geolocation is not supported by your browser");
        }
        const shareLocationButton = document.querySelector("#shareLocation")!;
        shareLocationButton.setAttribute("disabled", "disabled");
        navigator.geolocation.getCurrentPosition((postition) => {
            socket.emit("sendLocation", {
                lat: postition.coords.latitude,
                lng: postition.coords.longitude
            }, () => {
                shareLocationButton.removeAttribute("disabled");
                console.log("Location Shared!");
            });
        });
    }

    messageOnChange(e: any) {
        this.setState({ message: e.target.value });
    }

    render() {
        const { messageData } = this.props;
        const { message } = this.state;
        return (
            <div>
                <div className="chat">
                    <div id="sidebarContainer" className="chat__sidebar">
                        <Sidebar />
                    </div>
                    <div className="chat__main">
                        <div id="messagesContainer" className="chat__messages">
                            {messageData.map((data, i) => (
                                <div className="message" key={i}>
                                    <p>
                                        <span className="message__name">{data.username}</span>
                                        <span className="message__meta">{data.createdAt}</span>
                                    </p>
                                    {isUrl(data.text) ?
                                        (<a href={data.text} target="_blank" rel="noopener noreferrer">My current location</a>)
                                    :
                                        (<p>{data.text}</p>)
                                    }
                                </div>
                            ))}
                        </div>
                        <div className="compose">
                            <form id="messageForm" onSubmit={(e) => this.sendMessage(e)}>
                                <input 
                                    value={message}
                                    onChange={(e) => this.messageOnChange(e)}
                                    name="message"
                                    placeholder="Enter message"
                                    required
                                    autoComplete="off"
                                />
                                <button>Send</button>
                            </form>
                            <button onClick={() => this.shareLocation()} id="shareLocation" type="submit">
                                Share Location
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export const ChatRoom = Component;