import { Theme, createMuiTheme } from "@material-ui/core";

const cssOverrides = {
    palette: {
        primary: {
            main: localStorage.getItem("primaryColor") || "#eb4034",
            contrastText: "#ffffff"
        },
        secondary: {
            main: "#ffffff",
            contrastText: "#000000"
        }
    },
    typography: {
        subtitle1: {
            fontFamily: "Poppins",
            fontWeight: 600,
            fontSize: "24px"
        },
        subtitle2: {
            fontFamily: "Poppins",
            fontWeight: 400,
            fontSize: "20px"
        },
        body1: {
            fontFamily: "Roboto",
            fontWeight: 400,
            fontSize: "16px"
        },
        body2: {
            fontFamily: "Roboto",
            fontWeight: 300,
            fontSize: "14px"
        }
    }
};

export const theme = createMuiTheme(cssOverrides);

export const buttonStyle = (theme: Theme) => ({
    backgroundColor: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: "4px",
    color: theme.palette.primary.contrastText,
    transition: "all 0.4s",
    textTransform: "none",
    "& span": theme.typography.body1,
    "&:hover": {
        transition: "all 0.4s",
        backgroundColor: "#ffffff",
        color: theme.palette.primary.main
    }
});