import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import { withStyles } from "@material-ui/core/styles";

import { Link } from "react-router-dom";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh "
  },
  paper: {
    padding: theme.spacing.unit * 2,
    display: "flex",
    justifyContent: "center",
    flexFlow: "wrap"
  },
  form: {
    display: "flex",
    justifyContent: "center",
    flexFlow: "column",
    alignItems: "center"
  },
  copyInput: {
    display: "flex",
    justifyContent: "center"
  }
});

function Home({ history, location, classes }) {
  const [inputText, setInputText] = useState("");
  const channelNames = inputText.split(", ");
  let queryString = "";
  channelNames.forEach((n, i) => {
    if (!n.length) {
      return;
    }
    queryString.length ? (queryString += "&") : (queryString += "?");
    queryString += `c${i + 1}=${n}`;
  });
  const onSubmit = e => {
    e.preventDefault();
    history.push("/live" + queryString);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5" paragraph>
          Welcome. Enter channel names below separated by comma and space.
        </Typography>
      </Paper>
      <form className={classes.form} onSubmit={onSubmit}>
        <TextField
          value={inputText}
          placeholder="usr1, usr2, usr3, usr4"
          onChange={e => setInputText(e.target.value)}
        />
        {!!queryString.length && (
          <Link to={{ pathname: "/live", search: queryString }}>
            View Live Streams
          </Link>
        )}
      </form>
    </div>
  );
}

export default withStyles(styles)(Home);
