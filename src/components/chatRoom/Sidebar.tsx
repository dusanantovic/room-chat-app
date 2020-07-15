import * as React from "react";
import { ChatManager } from "../../chat";

const Component = () => (
    <ChatManager.ChatStateContext.Consumer>
        {state => (
            <React.Fragment>
                <h2 className="room-title">{state.room}</h2>
                <h3 className="list-title">Users</h3>
                <ul className="users">
                {state.users.map((user, i) => (
                    <li key={i}>{user.username}</li>
                ))}
                </ul>
            </React.Fragment>
        )}
    </ChatManager.ChatStateContext.Consumer>
);

export const Sidebar = Component;