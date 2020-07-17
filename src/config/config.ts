import { Config } from "./configTypes";

const configLocal = {
    apiUrl: "http://localhost:3001"
};

const configProd = {
    apiUrl: "https://room-chattingapp.herokuapp.com/"
};

let selectedConfig: Config | null = null;

switch (process.env.REACT_APP_STAGE) {
    case "local": selectedConfig = configLocal; break;
    case "prod": selectedConfig = configProd; break;
}

export const config = selectedConfig;