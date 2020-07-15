import { Config } from "./configTypes";

const configLocal = {
    apiUrl: "http://localhost:3001"
};

const configProd = {
    apiUrl: "https://room-chattingapp.herokuapp.com/"
};

let selectedConfig: Config | null = null;

switch (process.env.NODE_ENV) {
    case "development": selectedConfig = configLocal; break;
    case "production": selectedConfig = configProd; break;
}

export const config = selectedConfig;