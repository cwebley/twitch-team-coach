import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { RootContext } from "./RootContext";
import config from "./config";
import { withSnackbar } from "notistack";

const styles = {
  root: {
    // display: "flex",
    // justifyContent: "spaceBetween"
  },
  title: {
    textDecoration: "none"
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between"
  }
};

function getParamsString(options) {
  const params = [];
  for (const k in options) {
    params.push(`${k}=${options[k]}`);
  }
  return params.join(",");
}

const handleLogin = (setAuthToken, enqueueSnackbar) => {
  const url = `https://id.twitch.tv/oauth2/authorize?client_id=${
    config.oauthClientId
  }&redirect_uri=${config.hostname}/token&response_type=token`;
  const width = 600;
  const height = 750;

  const popupOptions = {
    width,
    height,
    toolbar: false,
    menubar: false,
    location: false,
    status: false,
    scrollbars: false,
    resizable: true,
    // center the popup on the user's screen
    left: window.screen.width / 2 - width / 2,
    right: window.screen.height / 2 - height / 2
  };

  const popupReference = window.open(
    url,
    Date.now(),
    getParamsString(popupOptions)
  );

  window.addEventListener(
    "message",
    e => {
      if (!e || !e.data) {
        return;
      }

      if (e.data.error) {
        console.error(e.data.error);
        enqueueSnackbar(`Twitch login error ${e.data.error}`);
        return;
      }
      if (e.data.token) {
        // close the popout
        popupReference.close();
        setAuthToken(e.data.token);
        enqueueSnackbar("Login successful");
      }
    },
    false
  );
};

const Header = ({ enqueueSnackbar, classes }) => {
  const { authToken, setAuthToken } = useContext(RootContext);

  return (
    <AppBar className={classes.root} position="static" color="default">
      <Toolbar className={classes.toolbar}>
        <Typography
          className={classes.title}
          variant="h6"
          color="inherit"
          component="a"
          href="/"
        >
          {config.title}
        </Typography>
        {authToken ? (
          <Button
            onClick={() => {
              setAuthToken("");
            }}
          >
            Logout
          </Button>
        ) : (
          <Button
            color="inherit"
            onClick={() => handleLogin(setAuthToken, enqueueSnackbar)}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(withSnackbar(Header));
