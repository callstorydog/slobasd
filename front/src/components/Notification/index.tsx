import React, { SyntheticEvent } from "react";

import clsx from "clsx";

import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { withStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import { amber, green } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import WarningIcon from "@material-ui/icons/Warning";
import Slide from "@material-ui/core/Slide";

const TransitionDown = (props: any) => {
  return <Slide {...props} direction="down" />;
};

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const styles = {
  root: {
    marginTop: 50,
    zIndex: 15000,
    maxWidth: 400
  },
  snackbarContentAction: {
    position: "absolute" as any,
    top: "-5px",
    right: "0px"
  },
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: "#d32f2f"
  },
  info: {
    backgroundColor: "#1976d2"
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: 10
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
};

interface NotificationComponentProps {
  open: boolean;
  className?: string;
  message?: string;
  variant: "success" | "warning" | "error" | "info";
  classes: any;
}

class NotificationComponent extends React.Component<
  NotificationComponentProps
> {
  state = {
    open: false
  };

  handleClose = (event: SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
  };

  componentDidUpdate(prevProps: NotificationComponentProps) {
    if (prevProps.open !== this.props.open) {
      this.setState({ open: this.props.open });
    }
  }

  render() {
    const { classes, className, message, variant, ...other } = this.props;
    const Icon: any = variantIcon[variant] as any;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={this.state.open}
        autoHideDuration={6000}
        onClose={this.handleClose.bind(this)}
        TransitionComponent={TransitionDown}
        classes={{
          root: classes.root
        }}
      >
        <SnackbarContent
          className={clsx(classes[variant], className)}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={clsx(classes.icon, classes.iconVariant)} />
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={this.handleClose.bind(this)}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>
          ]}
          classes={{
            action: classes.snackbarContentAction
          }}
          {...other}
        />
      </Snackbar>
    );
  }
}

export default withStyles(styles)(NotificationComponent);
