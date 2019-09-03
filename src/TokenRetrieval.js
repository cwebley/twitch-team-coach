import React, { useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { RootContext } from "./RootContext";
const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    // margin: `${theme.spacing.unit * 2} ${theme.spacing.unit * 10}`,
    // marginTop: theme.spacing.unit * 2
    height: "50vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    display: "flex",
    justifyContent: "center"
  }
});

const TokenRetrieval = ({ location, classes }) => {
  const splitHash = location.hash.split("access_token=");
  let token = "";
  if (splitHash.length > 1) {
    token = splitHash[1].split("&")[0];
  }

  const { setAuthToken } = useContext(RootContext);

  useEffect(() => {
    setAuthToken(token);

    // post message to the parent window
    if (window.opener && window.opener.postMessage) {
      window.opener.postMessage({ token }, window.origin);
    }
  }, []);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5">
          You are now logged in and can close this window
        </Typography>
      </Paper>
    </div>
  );
};

export default withStyles(styles)(TokenRetrieval);
