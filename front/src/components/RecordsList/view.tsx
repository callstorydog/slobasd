import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { GridList, Zoom, GridListTile } from "@material-ui/core";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretLeft, faCaretRight} from '@fortawesome/free-solid-svg-icons';

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
    },
    wrapper: {
      maxHeight: "85%"
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

export default withStyles(styles)((props: any) => {
  return (
    <div>
      <Dialog
        onClose={props.onClosed}
        aria-labelledby="customized-dialog-title"
        open={props.open}
        classes={{
          paper: props.classes.wrapper
        }}
        fullWidth
      >
        <DialogTitle id="customized-dialog-title" onClose={undefined as any}>
          View Story
        </DialogTitle>
        <DialogContent dividers>
          {!!props.tags &&
            props.tags.map((tag: any, i: number) => (
              <div
                key={`tag-${i}`}
                style={{
                  backgroundColor: "hsl(0,0%,90%)",
                  borderRadius: 2,
                  marginRight: 8,
                  marginBottom: 8,
                  display: "inline-block",
                  padding: 5
                }}
              >
                {tag}
              </div>
            ))}
          <Typography gutterBottom>{props.text}</Typography>
          {!!props.attachedImages && (
            <GridList
              style={{
                margin: 0
              }}
              cellHeight="auto"
              cols={2}
              spacing={60}
            >
              {props.attachedImages.map((image: string, i: number) => (
                <GridListTile
                  classes={{ root: props.classes.gridListTile }}
                  style={{ paddingBottom: 10, height: 300 }}
                >
                  <>
                    <IconButton
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0
                      }}
                      aria-label="delete"
                    >
                      <DeleteIcon
                        onClick={() => {
                          props.onDeleteButtonClick(props.id, image);
                        }}
                        fontSize="large"
                        color="secondary"
                      />
                    </IconButton>
                    <img width="100%" src={image} alt="image" />
                  </>
                </GridListTile>
              ))}
            </GridList>
          )}
        </DialogContent>
        <DialogActions>
            <FontAwesomeIcon
                 icon={faCaretLeft}
                 onClick={props.showPrevious}
                 size="lg"
                 style={{
                     position: 'absolute',
                     cursor: 'pointer',
                     left: '20px'
                 }}

            />
            <FontAwesomeIcon
                 icon={faCaretRight}
                 onClick={props.showNext}
                 size="lg"
                 style={{
                     position: 'absolute',
                     cursor: 'pointer',
                     left: '30px'
                 }}
            />
          <Button autoFocus onClick={props.onClosed} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
