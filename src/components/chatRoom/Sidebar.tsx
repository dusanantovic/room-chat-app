import * as React from "react";
import { ChatManager } from "../../chat";
import { IconButton, Drawer, withStyles, Theme, Button } from "@material-ui/core";
import { Menu, Close } from "@material-ui/icons";
import { buttonStyle } from "../../theme";
import { ColorPicker } from "./ColorPicker";

const buttonsStyle = (theme: Theme) => ({
    ...buttonStyle(theme),
    maxWidth: "100%"
});

let debounceTimer: NodeJS.Timeout;

const styles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main
    },
    buttonRoot: {
        color: theme.palette.primary.contrastText
    },
    sidebarRoot: {
        width: "25%",
        [theme.breakpoints.down("sm")]: {
            width: "100%"
        }
    },
    roomTitle: {
        padding: "0px 24px",
        height: "100px",
        display: "flex",
        alignItems: "center",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        ...theme.typography.subtitle1,
        "& button": {
            color: theme.palette.primary.contrastText
        }
    },
    usersTitle: {
        paddingLeft: "24px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #edecec",
        ...theme.typography.subtitle2
    },
    userList: {
        "& li": {
            margin: "0px 24px",
            height: "25px",
            display: "flex",
            alignItems: "center",
            ...theme.typography.body2
        }
    },
    typing: {
        marginLeft: "8px",
        color: "#9b9b9b"
    },
    you: {
        fontWeight: "400 !important"
    },
    grow: {
        flexGrow: 1
    },
    changeColorWrapper: {
        margin: "24px 24px 0px 24px",
        display: "flex",
        alignItems: "center"
    },
    colorPickerField: {
        cursor: "pointer",
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: "4px",
        width: "40px",
        padding: "4px 8px",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        "& input": {
            cursor: "pointer"
        }
    },
    changeColorText: {
        ...theme.typography.body1,
        marginLeft: "8px"
    },
    shareButton: {
        ...buttonsStyle(theme),
        margin: "24px 24px 0px 24px"
    },
    logoutButton: {
        ...buttonsStyle(theme),
        margin: "24px"
    }
});

interface ComponentProps {
    logout: () => void;
    classes?: any;
}

const Component = ({ logout, classes, ...props }: ComponentProps) => {
    const [open, setOpenDrawerState] = React.useState(false);
    const [openColorPicker, setOpenColorPicker] = React.useState(false);

    const changeColor = (socket: SocketIOClient.Socket, color: string) => {
        if(color) {
            if(typeof debounceTimer === "number") {
                clearTimeout(debounceTimer);
            }
            debounceTimer = setTimeout(() => {
                socket.emit("changeColor", color, () => {
                    console.log("Color changed!");
                });
            }, 300);
        }
    }

    const shareLocation = (socket: SocketIOClient.Socket) => {
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

    return (
        <div className={classes.root}>
            <IconButton className={classes.buttonRoot} onClick={() => setOpenDrawerState(true)}>
                <Menu />
            </IconButton>
            <Drawer
                open={open}
                onClose={() => setOpenDrawerState(false)}
                classes={{
                    paper: classes.sidebarRoot
                }}
            >
                <ChatManager.ChatStateContext.Consumer>
                    {state => (
                        <React.Fragment>
                            <div className={classes.roomTitle}>
                                <div>{state.room}</div>
                                <div className={classes.grow} />
                                <IconButton onClick={() => setOpenDrawerState(false)}>
                                    <Close />
                                </IconButton>
                            </div>
                            <div className={classes.usersTitle}>
                                Users
                            </div>
                            <ul className={classes.userList}>
                                {state.users.map((user, i) => {
                                    let typing = false;
                                    if(state.typing.length > 0) {
                                        typing = !!state.typing.find(t => t.username.toLocaleLowerCase() === user.username.toLocaleLowerCase() && t.typing);
                                    }
                                    return (
                                        <li key={i} className={user.username.toLocaleLowerCase() === state.username.toLocaleLowerCase() ? classes.you : ""}>
                                            {user.username} {typing ? <span className={[classes.typing, "pulse"].join(" ")}>typing...</span> : ""}
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className={classes.grow} />
                            <Button
                                onClick={() => setOpenColorPicker(true)}
                                className={classes.shareButton}
                            >
                                Color Settings
                            </Button>
                            {openColorPicker && (
                                <ColorPicker
                                    defaultColor={state.theme.palette.primary.main}
                                    onClose={() => setOpenColorPicker(false)}
                                    onChangeCallback={(color: string) => changeColor(state.socket!, color)}
                                />
                            )}
                            <Button
                                id="shareLocation"
                                onClick={() => shareLocation(state.socket!)}
                                className={classes.shareButton}
                            >
                                Share Location
                            </Button>
                            <Button
                                onClick={() => logout()}
                                className={classes.logoutButton}
                            >
                                Logout
                            </Button>
                        </React.Fragment>
                    )}
                </ChatManager.ChatStateContext.Consumer>
            </Drawer>
        </div>
    );
}

export const Sidebar = withStyles(styles as any)(Component);