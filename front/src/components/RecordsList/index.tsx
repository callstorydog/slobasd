import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHeadphonesAlt, faSearch, faImage } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import { Data, Column } from "@models/Table";

import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";

import { withRouter } from "react-router";

import * as _ from "lodash";

//models
import { ThunkDispatch } from "redux-thunk";
import { ReduxState, Process, ProcessStatus } from "@models/redux";
import { processes } from "@redux/actions";
import { History } from "history";
import { Record } from "@models/api";

import * as actions from "@redux/actions";

import Notification from "@components/Notification";
import Header from "@components/Layout/header";
import Footer from "@components/Layout/footer";

import * as config from "@config";
import RecordView from "./view";
import RecordListen from "./listen";
import RecordEdit from "./edit";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const columns = (props: any, classes: any, openViewDialog: any) =>
  [
    /*{
    id: "id",
    label: "ID",
    format: (value: string) => value,
    align: "center",
    width: 300
  },*/
    {
      id: "messageText",
      label: "My Stories",
      format: (row: any, value: String) => (!!value ? value.slice(0, 50) + " more ..." : ""),
      align: "center",
      onClick: openViewDialog
    }
  ] as Column[];

const styles = {
  input: {
    display: "none"
  },
  header: {
    marginBottom: 10
  },
  inputPaper: {
    display: "flex",
    width: "100%"
  },
  inputPaperMobile: {
    display: "flex",
    width: "100%",
    flexDirection: "column-reverse" as any
  },
  flex: {
    display: "flex"
  },
  recordsLoadingProgress: {
    display: "flex",
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute" as any
  },
  logoutButtonBlock: {
    paddingBottom: 10,
    paddingTop: 10,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 15
  },
  fullWidthDevicesContainer: {
    width: "100%",
    margin: 0,
    paddingBottom: "60px"
  },
  tableContainer: {
    maxHeight: "650px"
  }
};

interface RecordsListComponentProps {
  history: History;
  dispatch: ThunkDispatch<any, any, any>;
  records: Record[];
  recordsLoadingProcess?: Process;
  recordDeletingProcess?: Process;
  classes: any;
}

interface RecordsListComponentState {
  activeRecord?: Record;
  page: 0;
  rowsPerPage: 10;
  screenWidth: number;
  screenHeight: number;
  scrollY?: number;
  errorMessage?: string;
  recordViewOpen?: boolean;
  recordListenOpen?: boolean;
  recordEditOpen?: boolean;
  confirmationDialogOpen: boolean;
}

class RecordsListComponent extends React.Component<
  RecordsListComponentProps,
  RecordsListComponentState
> {
  state = {
    page: 0,
    rowsPerPage: 10,
    recordViewOpen: false,
    recordListenOpen: false,
    recordEditOpen: false,
    confirmationDialogOpen: false,
  } as RecordsListComponentState;

  async componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("scroll", this.handleScroll.bind(this));
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    this.props.dispatch(actions.setInitialRecordsList());
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  handleChangePage(event: unknown, newPage: number) {
    this.setState({
      page: newPage
    } as any);
  }

  handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      rowsPerPage: +event.target.value,
      page: 0
    } as any);
  }

  componentDidUpdate(prevProps: RecordsListComponentProps) {
    if (
      !!prevProps.recordsLoadingProcess &&
      prevProps.recordsLoadingProcess.status === ProcessStatus.RUNNING &&
      (!!this.props.recordsLoadingProcess &&
        this.props.recordsLoadingProcess.status === ProcessStatus.FINISHED)
    ) {
      if (!!this.props.recordsLoadingProcess.error)
        this.setState({ errorMessage: config.RECORDS_LOADING_ERROR });
    }
    if (
      JSON.stringify(prevProps.records) !== JSON.stringify(this.props.records)
    ) {
      if (!!this.state.activeRecord) {
        this.setState({
          activeRecord: this.props.records.find(
            record =>
              this.state.activeRecord &&
              record.id === this.state.activeRecord.id
          )
        });
      }
    }
  }

  updateWindowDimensions() {
    this.setState({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    });
  }

  handleScroll(e: any) {
    this.setState({
      scrollY: window.scrollY
    });
  }

  openViewDialog(row: any) {
    this.setState({
      recordViewOpen: true,
      activeRecord: row
    } as any);
  }

    openConfirmationDialog(row: any) {
      this.setState({
        confirmationDialogOpen: true,
        activeRecord: row
      });
    }

    closeConfirmationDialog() {
      this.setState({
        confirmationDialogOpen: false
      });
    }

    deleteRow(row: any) {
      this.props.dispatch(
        actions.deleteRecord(row)
      );
      this.closeConfirmationDialog();
    }

    showPrevious() {
      let index = this.props.records.findIndex(record => record === this.state.activeRecord);
      // If we are on the first record should not go to previous
      if(index > 0) {
        let prevRecord = this.props.records[index - 1];
        this.setState({activeRecord: prevRecord});
      }
    }

    showNext() {
      let index = this.props.records.findIndex(record => record === this.state.activeRecord);
      // If the record is not found index will be -1 and if we are on the last record should not go to next
      if(index !== -1 && index < this.props.records.length - 1) {
        let prevRecord = this.props.records[index + 1];
        this.setState({activeRecord: prevRecord});
      }
    }

  render() {
    const {
      classes,
      records,
      recordsLoadingProcess,
      recordDeletingProcess
    } = this.props;
    const { page, rowsPerPage, screenWidth } = this.state;
    return (
      <div
        style={{
          position: "relative",
          minHeight: "100vh"
        }}
      >
        <Header />
        <Container maxWidth="xl" className={classes.fullWidthDevicesContainer}>
          {((!!recordsLoadingProcess &&
            recordsLoadingProcess.status === ProcessStatus.RUNNING) ||
            (!!recordDeletingProcess &&
              recordDeletingProcess.status === ProcessStatus.RUNNING)) && (
            <div
              style={{
                display: "flex",
                justifyContent: "center"
              }}
            >
              <CircularProgress />
            </div>
          )}
          {!!recordsLoadingProcess &&
            recordsLoadingProcess.status === ProcessStatus.FINISHED &&
            (!!!recordDeletingProcess ||
              recordDeletingProcess.status === ProcessStatus.FINISHED) && (
              <Paper className={classes.root}>
                <>
                  <TableContainer className={classes.tableContainer}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columns(this.props, classes, null).map(column => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{
                                minWidth: column.minWidth,
                                width: column.width,
                                maxWidth: column.maxWidth
                              }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                          <TableCell
                            key={"actions"}
                            align={"center"}
                            style={{ width: "100px" }}
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody style={{ wordBreak: "break-word" }}>
                        {records
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row: any, i: number) => {
                            return (
                              <TableRow
                                key={`table-row-${i}`}
                                hover
                                role="checkbox"
                                tabIndex={-1}
                              >
                                {columns(this.props, classes, () =>
                                  this.openViewDialog(row)
                                ).map(column => {
                                  const value = row[column.id] as string;
                                  return (
                                    <TableCell
                                      onClick={() => {
                                        if (!!column.onClick) {
                                          column.onClick();
                                        }
                                      }}
                                      style={{
                                        cursor: !!column.onClick
                                          ? "pointer"
                                          : ""
                                      }}
                                      key={column.id}
                                      align={column.align}
                                    >
                                      {!!column.format
                                        ? column.format(
                                            JSON.parse(JSON.stringify(row)),
                                            value
                                          )
                                        : value}
                                    </TableCell>
                                  );
                                })}
                                <TableCell key={"actions"} align={"center"}>
                                  <p>
                                      <FontAwesomeIcon
                                          icon={faEdit}
                                          onClick={() =>
                                              this.setState({
                                                  recordEditOpen: true,
                                                  activeRecord: row
                                              } as any)
                                          }
                                          size="lg"
                                          style={{
                                              cursor: 'pointer',
                                              padding: '3px'
                                          }}
                                      />
                                      <FontAwesomeIcon
                                           icon={faTrashAlt}
                                           onClick={() => this.openConfirmationDialog(row)}
                                           size="lg"
                                           style={{
                                               cursor: 'pointer',
                                               padding: '3px'
                                           }}
                                      />
                                  </p>
                                    <Dialog
                                        open={this.state.confirmationDialogOpen && row === this.state.activeRecord}
                                        onClose={() => this.closeConfirmationDialog()}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">{"Delete confirmation"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Are you sure you want to delete this story?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => this.closeConfirmationDialog()} color="primary" autoFocus>NO</Button>
                                            <Button onClick={() => this.deleteRow(row)} color="primary">YES</Button>
                                        </DialogActions>
                                    </Dialog>
                                  <p>
                                      <FontAwesomeIcon
                                           icon={faSearch}
                                           onClick={() =>
                                               this.setState({
                                                   recordViewOpen: true,
                                                   activeRecord: row
                                               } as any)
                                           }
                                           size="lg"
                                           style={{
                                               cursor: 'pointer',
                                               padding: '3px'
                                           }}
                                      />
                                      <FontAwesomeIcon
                                           icon={faHeadphonesAlt}
                                           onClick={() => {
                                               this.props.dispatch(
                                                   actions.getRecordAudioUrl(
                                                       row.id,
                                                       row.phoneNumber
                                                   )
                                               );
                                               this.setState({
                                                   recordListenOpen: true,
                                                   activeRecord: row
                                               } as any);
                                           }}
                                           size="lg"
                                           style={{
                                               cursor: 'pointer',
                                               padding: '3px'
                                           }}
                                      />
                                  </p>
                                  <p key={`attachedImage-${row.id}`}>
                                      <input
                                          onChange={e => {
                                              if (!!e.target.files) {
                                                  const reader = new FileReader();
                                                  reader.readAsDataURL(e.target.files[0]);
                                                  reader.onload = () => {
                                                      this.props.dispatch(
                                                          actions.updateRecordImage(
                                                              row["id"],
                                                              reader.result as string
                                                          )
                                                      );
                                                  };
                                                  e.target.value = null as any;
                                              }
                                          }}
                                          accept="image/*"
                                          className={classes.input}
                                          id={`text-button-file-${row.id}`}
                                          multiple
                                          type="file"
                                      />
                                  <label htmlFor={`text-button-file-${row.id}`}>
                                      <FontAwesomeIcon
                                           icon={faImage}
                                           size="lg"
                                           style={{
                                               cursor: 'pointer',
                                               padding: '3px'
                                           }}
                                      />
                                  </label>
                                  </p>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={records.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage.bind(this)}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage.bind(
                      this
                    )}
                  />
                </>
              </Paper>
            )}
        </Container>
        <Footer />
        <Notification
          open={!!this.state.errorMessage}
          message={this.state.errorMessage}
          variant={"error"}
        />
        <RecordView
          open={this.state.recordViewOpen}
          onClosed={() => this.setState({ recordViewOpen: false })}
          showPrevious={() => this.showPrevious()}
          showNext={() => this.showNext()}
          id={!!this.state.activeRecord ? this.state.activeRecord.id : ""}
          text={
            !!this.state.activeRecord ? this.state.activeRecord.messageText : ""
          }
          date={!!this.state.activeRecord ?  this.state.activeRecord.createdAt : ""}
          attachedImages={
            !!this.state.activeRecord
              ? this.state.activeRecord.attachedImages
              : ""
          }
          tags={!!this.state.activeRecord ? this.state.activeRecord.tags : ""}
          onDeleteButtonClick={(recordId: string, imageUrl: string) =>
            this.props.dispatch(actions.deleteRecordImage(recordId, imageUrl))
          }
        />
        <RecordListen
          open={this.state.recordListenOpen}
          onClosed={() => this.setState({ recordListenOpen: false })}
          activeRecord={this.state.activeRecord}
        />
        <RecordEdit
          open={this.state.recordEditOpen}
          onClosed={() => this.setState({ recordEditOpen: false })}
          onSaved={(newText: string, newTags: string[]) => {
            this.props.dispatch(
              actions.updateRecordText(
                Object.assign(this.state.activeRecord, {
                  messageText: newText,
                  tags: newTags
                })
              )
            );
          }}
          text={
            !!this.state.activeRecord ? this.state.activeRecord.messageText : ""
          }
          tags={!!this.state.activeRecord ? this.state.activeRecord.tags : ""}
          availableTags={_.uniqBy(
            this.props.records.reduce((acc: any[], item: Record) => {
              if (!!item.tags) {
                acc.push(
                  ...item.tags.map((tag: string) => ({
                    value: tag,
                    label: tag
                  }))
                );
              }
              return acc;
            }, []),
            "value"
          )}
        />
      </div>
    );
  }
}

export default withRouter(
  connect((state: ReduxState) => ({
    records: !!state ? state.records : [],
    recordsLoadingProcess: state.processes.find(
      proc => proc.name === processes.RECORDS_LOADING
    ),
    recordDeletingProcess: state.processes.find(
      proc => proc.name === processes.RECORD_DELETING
    )
  }))(withStyles(styles)(RecordsListComponent))
);
