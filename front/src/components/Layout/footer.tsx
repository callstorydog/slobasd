import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  footer: {
    position: "absolute" as any,
    bottom: 0,
    marginTop: 0,
    fontSize: 14
  },
  headerPaper: {
    padding: "10px 0",
    display: "flex",
    width: "100%"
  },
  headerPaperMobile: {
    display: "flex",
    width: "100%",
    flexDirection: "column-reverse" as any
  },
  copyrightBlock: {
    display: "flex",
    justifyContent: "center"
  }
};

class Footer extends React.Component<any, any> {
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
      <Grid className={classes.footer} container spacing={1}>
        <Paper className={classes.headerPaper}>
          <Grid className={classes.copyrightBlock} item sm={12}>
            Copyright © 2020 StoryDog | Privacy Policy | Terms of Service
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(Footer);
