import { Config } from "./configTypes";

const configLocal = {
    apiUrl: "http://localhost:3001"
};

const configProd = {
    apiUrl: "https://bolt-room-chat-app.herokuapp.com"
};

let selectedConfig: Config | null = null;

switch (process.env.NODE_ENV) {
    case "development": selectedConfig = configLocal; break;
    case "production": selectedConfig = configProd; break;
}

export const config = selectedConfig;