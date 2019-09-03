import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FileCopy from "@material-ui/icons/FileCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import config from "./config";

const styles = {
  root: {
    // display: "flex",
  }
};

const LinkCreator = ({ pathname, query }) => {
  return (
    <div>
      <div>
        <CopyToClipboard text={`${pathname}/archive${query}`}>
          <IconButton>
            <FileCopy />
          </IconButton>
        </CopyToClipboard>
        <TextField value={`${pathname}/archive${query}`} />
      </div>
      <Link
        to={{
          pathname: "/archive",
          search: query
        }}
      >
        Go There
      </Link>
    </div>
  );
};

export default withStyles(styles)(LinkCreator);
