import * as React from "react";
import { Router, Route } from "react-router-dom";
import { ChatRoom } from "./chatRoom";
import { Join } from "./join";
import { ChatManager } from "../chat";
import { history } from "./app";

const Component = () => (
    <Router history={history}>
        <Route path="/" exact={true}>
            <ChatManager.ChatStateContext.Consumer>
                {state => (
                    <Join logout={state.logout} />
                )}
            </ChatManager.ChatStateContext.Consumer>
        </Route>
        <Route path="/chat_room" exact={true}>
            <ChatManager.ChatStateContext.Consumer>
                {state => (
                    <ChatRoom
                        socket={state.socket!}
                        messageData={state.messageData}
                        join={state.join}
                        logout={state.logout}
                    />
                )}
            </ChatManager.ChatStateContext.Consumer>
        </Route>
    </Router>
);

export const Routes = Component;