import * as React from "react";
import isUrl from "is-url";
import { Sidebar } from "./Sidebar";
import { MessageData } from "../../interfaces";
import { withStyles, Theme, TextField, Button } from "@material-ui/core";
import { buttonStyle } from "../../theme";
import { ChatManager } from "../../chat";

const styles = (theme: Theme) => ({
    root: {
        display: "flex"
    },
    fullWidth: {
        display: "flex",
        width: "100%"
    },
    chatWrapper: {
        maxHeight: "100vh",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column"
    },
    chatMessageWrapper: {
        flexGrow: "1",
        padding: "24px 24px 0px 24px",
        overflowY: "scroll"
    },
    message: {
        marginBottom: "18px"
    },
    messageTitle: {
        ...theme.typography.subtitle1,
        fontSize: "16px",
        marginRight: "8px"
    },
    messageMeta: {
        ...theme.typography.subtitle2,
        fontSize: "14px",
        color: "#777777"
    },
    messageText: theme.typography.body1,
    messageInputWrapper: {
        display: "flex",
        flexShrink: 0,
        marginTop: "16px",
        padding: "0px 24px 24px 24px",
        "& form": {
            height: "50px",
            display: "flex",
            alignItems: "center",
            width: "100%"
        }
    },
    messageInput: {
        border: "1px solid #edecec",
        padding: "8px 14px",
        width: "100%"
    },
    sendButton: {
        ...buttonStyle(theme),
        marginLeft: "16px",
        height: "50px"
    }
});

interface ComponentProps {
    socket: SocketIOClient.Socket;
    messageData: MessageData[];
    classes?: any;
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

    messageOnChange(e: any) {
        this.setState({ message: e.target.value });
    }

    render() {
        const { messageData, classes } = this.props;
        const { message } = this.state;
        return (
            <div className={classes.root}>
                <ChatManager.ChatStateContext.Consumer>
                    {state => (
                        <Sidebar logout={state.logout} />
                    )}
                </ChatManager.ChatStateContext.Consumer>
                <div className={classes.fullWidth}>
                    <div className={classes.chatWrapper}>
                        <div id="messagesContainer" className={classes.chatMessageWrapper}>
                            {messageData.map((data, i) => (
                                <div className={classes.message} key={i}>
                                    <p>
                                        <span className={classes.messageTitle}>{data.username}</span>
                                        <span className={classes.messageMeta}>{data.createdAt}</span>
                                    </p>
                                    {isUrl(data.text) ?
                                        (
                                            <a className={classes.messageText} href={data.text} target="_blank" rel="noopener noreferrer">
                                                My current location
                                            </a>
                                        )
                                    :
                                        (
                                            <p className={classes.messageText}>
                                                {data.text}
                                            </p>
                                        )
                                    }
                                </div>
                            ))}
                        </div>
                        <div className={classes.messageInputWrapper}>
                            <form id="messageForm" onSubmit={(e) => this.sendMessage(e)}>
                                <TextField
                                    value={message}
                                    onChange={(e) => this.messageOnChange(e)}
                                    name="message"
                                    placeholder="Enter message"
                                    required
                                    autoComplete="off"
                                    className={classes.messageInput}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                />
                                <Button type="submit" className={classes.sendButton}>
                                    Send
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export const ChatRoom = withStyles(styles as any)(Component);