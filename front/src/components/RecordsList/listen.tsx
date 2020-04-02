import React from "react";
import { useSelector } from "react-redux";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import ReactAudioPlayer from "react-audio-player";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2)
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default function CustomizedDialogs(props: any) {
  const activeRecord = useSelector((state: any) =>
    !!props.activeRecord
      ? state.records.find((record: any) => props.activeRecord.id === record.id)
      : null
  );
  return (
    <div>
      <Dialog
        onClose={props.onClosed}
        aria-labelledby="customized-dialog-title"
        open={props.open}
        fullWidth
      >
        <DialogTitle id="customized-dialog-title" onClose={undefined as any}>
          Play Story
        </DialogTitle>
        <DialogContent dividers>
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            {!!activeRecord && !!activeRecord.audioUrl ? (
              <ReactAudioPlayer
                title={`${activeRecord.id}.mp3`}
                src={!!activeRecord ? activeRecord.audioUrl : ""}
                controls
              >
                Audio
              </ReactAudioPlayer>
            ) : (
              <CircularProgress />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.onClosed} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
