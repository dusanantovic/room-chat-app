import React from "react";
import { SketchPicker } from "react-color";
import { IconButton, withStyles, Theme } from "@material-ui/core";
import { Close } from "@material-ui/icons";

const styles = (theme: Theme) => ({
    popover: {
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "2",
        backgroundColor: "rgba(0, 0, 0, 0.3)"
    },
    mainWrapper: {
        textAlign: "right",
        backgroundColor: "#ffffff",
        padding: "8px",
        borderRadius: "4px"
    },
    pickerDefault: {
        boxShadow: "unset !important",
        fontFamily: "Roboto",
        textAlign: "center"
    }
});

interface ComponentProps {
    defaultColor: string;
    onClose: () => void;
    onChangeCallback: (color: string) => void;
    classes?: any;
}
interface ComponentState {
    color: string;
}

class Component extends React.Component<ComponentProps, ComponentState> {
    constructor(props: ComponentProps) {
        super(props);
        const { defaultColor } = props;
        this.state = {
            color: defaultColor
        };
    }

    handleChange = (color: any) => {
        const { onChangeCallback } = this.props;
        this.setState({ color: color.hex });
        onChangeCallback(color.hex);
    };

    render() {
        const { onClose, classes } = this.props;
        return (
            <div className={classes.popover}>
                <div className={classes.mainWrapper}>
                    <IconButton onClick={() => onClose()}>
                        <Close />
                    </IconButton>
                    <SketchPicker
                        className={classes.pickerDefault}
                        disableAlpha={true}
                        color={ this.state.color as any }
                        onChange={ this.handleChange }
                    />
                </div>
            </div>
        );
    }
}

export const ColorPicker = withStyles(styles as any)(Component);