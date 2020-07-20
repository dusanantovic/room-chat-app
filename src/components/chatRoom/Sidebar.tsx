import * as React from "react";
import { ChatManager } from "../../chat";
import { IconButton, Drawer, withStyles, Theme, Button } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { buttonStyle } from "../../theme";

const buttonsStyle = (theme: Theme) => ({
    ...buttonStyle(theme),
    maxWidth: "100%"
});

const styles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        height: "100vh"
    },
    buttonRoot: {
        color: theme.palette.primary.contrastText
    },
    sidebarRoot: {
        width: "20%",
        [theme.breakpoints.down("sm")]: {
            width: "50%"
        }
    },
    roomTitle: {
        paddingLeft: "24px",
        height: "100px",
        display: "flex",
        alignItems: "center",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        ...theme.typography.subtitle1
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
    logout: (redirect: boolean) => void;
    classes?: any;
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

const Component = ({ logout, classes, ...props }: ComponentProps) => {
    const [open, setState] = React.useState(false);
    return (
        <div className={classes.root}>
            <IconButton className={classes.buttonRoot} onClick={() => setState(true)}>
                <Menu />
            </IconButton>
            <Drawer
                open={open}
                onClose={() => setState(false)}
                classes={{
                    paper: classes.sidebarRoot
                }}
            >
                <ChatManager.ChatStateContext.Consumer>
                    {state => (
                        <React.Fragment>
                            <div className={classes.roomTitle}>
                                {state.room}
                            </div>
                            <div className={classes.usersTitle}>
                                Users
                            </div>
                            <ul className={classes.userList}>
                                {state.users.map((user, i) => {
                                    let typing = false;
                                    if(state.typing.length > 0) {
                                        typing = !!state.typing.find(t => t.username === user.username && t.typing);
                                    }
                                    return (
                                        <li key={i} className={user.username === state.username ? classes.you : ""}>
                                            {user.username} {typing ? <span className={[classes.typing, "pulse"].join(" ")}>typing...</span> : ""}
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className={classes.grow} />
                            <Button
                                id="shareLocation"
                                onClick={() => shareLocation(state.socket!)}
                                className={classes.shareButton}
                            >
                                Share Location
                            </Button>
                            <Button
                                id="shareLocation"
                                onClick={() => logout(true)}
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