import * as React from "react";
import { Card, CardHeader, TextField, Button, CardContent, CardActions, withStyles, Theme, Grid } from "@material-ui/core";
import { history } from "../app";

export const buttonStyle = (theme: Theme) => ({
    backgroundColor: "#eb4034",
    border: "2px solid #eb4034",
    borderRadius: "4px",
    color: "#ffffff",
    transition: "all 0.4s",
    textTransform: "none",
    "&:hover": {
        transition: "all 0.4s",
        backgroundColor: "#ffffff",
        color: "#eb4034"
    }
});

const styles = (theme: Theme) => ({
    container: {
        backgroundColor: "#edecec",
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100vh"
    },
    center: {
        display: "flex",
        justifyContent: "center"
    },
    cardRoot: {
        width: "30%",
        height: "250px",
        [theme.breakpoints.down("md")]: {
            width: "90%",
            height: "350px"
        }
    },
    header: {
        color: "#ffffff",
        backgroundColor: "#eb4034"
    },
    actionRoot: {
        marginTop: "24px",
        justifyContent: "center",
        [theme.breakpoints.down("md")]: {
            marginTop: "32px"
        }
    },
    button: buttonStyle(theme)
});

interface ComponentProps {
    socket: SocketIOClient.Socket
    classes?: any;
}

interface ComponentState {
    username: string;
    room: string;
}

class Component extends React.Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props);
        this.state = {
            username: localStorage.getItem("username") || "",
            room: localStorage.getItem("room") || ""
        };
    }

    join() {
        const { socket } = this.props;
        const { username, room } = this.state;
        if (!username) {
            return alert("Username is required");
        }
        if (!room) {
            return alert("Room is required");
        }
        socket.emit("join", { username, room }, (error: string) => {
            if (error) {
                alert(error);
                return;
            }
            localStorage.setItem("username", username);
            localStorage.setItem("room", room);
            history.push("/chat_room");
        });
    }

    onChange(e: any) {
        const value = e.target.value;
        const name = e.target.name;
        this.setState({ ...this.state, [name]: value });
    }

    render() {
        const { classes } = this.props;
        const { username, room } = this.state;
        return (
            <Grid container className={classes.container}>
                <Grid item xs={12} className={classes.center}>
                    <Card className={classes.cardRoot}>
                        <CardHeader className={classes.header} title="Join" />
                        <CardContent>
                            <Grid container spacing={5}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        value={username}
                                        onChange={(e) => this.onChange(e)}
                                        onKeyUp={(e) => e.keyCode === 13 && this.join()}
                                        type="text"
                                        name="username"
                                        label="Display Name"
                                        placeholder="Display name"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        value={room}
                                        onChange={(e) => this.onChange(e)}
                                        onKeyUp={(e) => e.keyCode === 13 && this.join()}
                                        type="text"
                                        name="room"
                                        label="Room"
                                        placeholder="Room"
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions className={classes.actionRoot}>
                            <Button onClick={() => this.join()} className={classes.button}>
                                Confirm
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

export const Join = withStyles(styles as any)(Component);