import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import RecordsList from "@components/RecordsList";
import Profile from "@components/Profile";

//configs
import "@config/amplify";
import { ReduxState } from "@models/redux";

//css

class App extends React.Component<any> {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="*">
            <RecordsList />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default connect((state: ReduxState) => ({}))(App);
