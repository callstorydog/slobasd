import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { withStyles } from "@material-ui/core/styles";

import { Auth } from "aws-amplify";

const styles = {
  header: {
    marginBottom: 10
  },
  headerPaper: {
    display: "flex",
    width: "100%"
  },
  headerPaperMobile: {
    display: "flex",
    width: "100%"
  },
  logoutButtonBlock: {
    paddingBottom: 10,
    paddingTop: 10,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 15,
    width: "100%",
  }
};

class Header extends React.Component<any, any> {
  state = {
    screenWidth: window.innerWidth
  };

  async componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      screenWidth: window.innerWidth
    });
  }
  render() {
    const { classes } = this.props;
    const { screenWidth } = this.state;
    return (
      <Grid className={classes.header} container spacing={1}>
        <Paper
          style={{ zIndex: screenWidth > 650 ? 1500 : 1 }}
          className={
            screenWidth > 650 ? classes.headerPaper : classes.headerPaperMobile
          }
        >
          <Grid
            style={{
              display: "flex",
              paddingLeft: 35,
              alignItems: "center"
            }}
            item
            sm={screenWidth > 650 ? 3 : 6}
          >
            <Link
              style={{
                marginRight: 30
              }}
              href="/"
              color="primary"
            >
              Home
            </Link>
            <Link href="/profile" color="primary">
              Profile
            </Link>
          </Grid>
          <Grid item sm={screenWidth > 650 ? 7 : 12}></Grid>
          <Grid
            item
            sm={screenWidth > 650 ? 2 : 6}
            className={classes.logoutButtonBlock}
          >
            <Button
              onClick={() => Auth.signOut()}
              variant="contained"
              color="secondary"
              size={screenWidth > 800 || screenWidth < 650 ? "small" : "small"}
              startIcon={<ExitToAppIcon />}
            >
              Logout
            </Button>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(Header);
