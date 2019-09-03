import React, { Component } from "react";
import "./App.css";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Live from "./Live.js";
import Archive from "./Archive.js";
import Header from "./Header.js";
import TokenRetrieval from "./TokenRetrieval.js";
import RootContext from "./RootContext";
import Home from "./Home";
import { SnackbarProvider } from "notistack";

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <RootContext>
            <Header />
            <Router>
              <Switch>
                <Route path="/token" component={TokenRetrieval} />
                <Route path="/archive" component={Archive} />
                <Route path="/live" component={Live} />
                <Route path="/" component={Home} />
              </Switch>
            </Router>
          </RootContext>
        </SnackbarProvider>
      </MuiThemeProvider>
    );
  }
}

export default App;
