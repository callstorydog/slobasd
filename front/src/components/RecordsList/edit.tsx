import React, { useState, useEffect } from "react";
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
import TextField from "@material-ui/core/TextField";
import CreatableSelect from "react-select/creatable";
import { InputLabel } from "@material-ui/core";

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
  const [text, setText] = useState("");
  const [tagsFocused, setTagsFocused] = useState(false);
  const [tags, setTags] = useState([] as any);
  useEffect(() => {
    setText(props.text);
  }, [props.text]);
  useEffect(() => {
    if (!!props.tags)
      setTags(
        props.tags.map((tag: string) => ({
          value: tag,
          label: tag
        }))
      );
    else setTags([]);
  }, [props.tags]);
  return (
    <div>
      <Dialog
        onClose={props.onClosed}
        aria-labelledby="customized-dialog-title"
        open={props.open}
        fullWidth
      >
        <DialogTitle id="customized-dialog-title" onClose={undefined as any}>
          Edit Story
        </DialogTitle>
        <DialogContent dividers>
          <InputLabel
            style={{
              position: "absolute",
              backgroundColor: "white",
              paddingLeft: 2,
              paddingRight: 2
            }}
            variant="outlined"
            shrink={true}
            focused={tagsFocused}
          >
            Tags
          </InputLabel>
          <CreatableSelect
            isClearable
            onChange={(value: any) => {
              setTags(value);
            }}
            defaultValue={tags}
            onFocus={() => {
              setTagsFocused(true);
            }}
            onBlur={() => {
              setTagsFocused(false);
            }}
            isMulti
            name="colors"
            options={props.availableTags}
            className="basic-multi-select"
            classNamePrefix="select"
            styles={{
              menu: (provided, state) => ({
                ...provided,
                zIndex: 1500
              }),
              control: (provided, state) => ({
                ...provided,
                borderColor: state.isFocused ? "#2d3b7d !important" : "",
                boxShadow: !!state.isFocused ? "0 0 0 1px #2d3b7d" : ""
              })
            }}
          />
          <Typography
            style={{
              marginTop: 20
            }}
            gutterBottom
          >
            <TextField
              id="outlined-multiline-static"
              label="Story"
              multiline
              rows="10"
              value={text}
              onChange={e => {
                setText(e.target.value);
              }}
              variant="outlined"
              fullWidth
            />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.onClosed} color="primary">
            Close
          </Button>
          <Button
            autoFocus
            onClick={() => {
              props.onSaved(
                text,
                !!tags ? tags.map((tag: any) => tag.value) : []
              );
              props.onClosed();
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
