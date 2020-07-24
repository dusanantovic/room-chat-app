import * as React from "react";
import { Card, CardHeader, TextField, Button, CardContent, CardActions, withStyles, Theme, Grid } from "@material-ui/core";
import { history } from "../app";
import { buttonStyle } from "../../theme";

const styles = (theme: Theme) => ({
    container: {
        backgroundColor: "#edecec",
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%"
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
    item: {
        padding: "20px"
    },
    header: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        ...theme.typography.subtitle1
    },
    actionRoot: {
        justifyContent: "center"
    },
    button: buttonStyle(theme)
});

interface ComponentProps {
    logout: (redirect: boolean) => void;
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
            username: "",
            room: ""
        };
    }

    componentDidMount() {
        const { username, room } = this.state;
        const { logout } = this.props;
        if(username && room) {
            logout(false);
        }
    }

    join() {
        const { username, room } = this.state;
        if (!username) {
            return alert("Username is required");
        }
        if (!room) {
            return alert("Room is required");
        }
        localStorage.setItem("username", username);
        localStorage.setItem("room", room);
        history.push("/chat_room");
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
                            <Grid container>
                                <Grid item xs={12} md={6} className={classes.item}>
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
                                <Grid item xs={12} md={6} className={classes.item}>
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