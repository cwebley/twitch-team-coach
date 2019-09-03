import React, { useState, useRef } from "react";
import "./App.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import LinkCreator from "./Link-Creator.js";
import FileCopy from "@material-ui/icons/FileCopy";
import Sync from "@material-ui/icons/Sync";
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutline from "@material-ui/icons/PauseCircleOutline";
import Player from "./Player.js";
import { withStyles } from "@material-ui/core/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { hmsToFloat } from "./utils";
import config from "./config";

const styles = theme => ({
  masterControls: {
    display: "flex",
    justifyContent: "center"
  },
  createLinkContainer: {
    display: "flex",
    justifyContent: "center",
    flexFlow: "column wrap"
  },
  playerGrid: {
    maxWidth: "100vh",
    margin: "auto"
  },
  copyInput: {
    display: "flex",
    justifyContent: "center"
  },
  textField: {
    // width: "100px"
  },
  seekForm: {
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

function Archive({ location, classes }) {
  let params = new URLSearchParams(location.search);
  const playerRefs = [];
  [1, 2, 3, 4].forEach(n => {
    if (params.get(`v${n}`)) {
      playerRefs.push({
        ref: useRef(),
        videoId: params.get(`v${n}`),
        startTime: params.get(`t${n}`) || 0
      });
    }
  });

  const [isPlaying, setPlaying] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [seekText, setSeekValue] = useState("");

  const handlePlayClick = () => {
    setPlaying(true);
  };

  const handlePauseClick = () => {
    setPlaying(false);
  };

  const handleSync = masterIndex => {
    setPlaying(false);
    const masterTime = playerRefs[masterIndex].ref.current.getCurrentTime();
    const masterStartTimeFloat = parseFloat(playerRefs[masterIndex].startTime);
    const difference = masterTime - masterStartTimeFloat;

    // filter master from players, seek to the new time for for each player leftover
    const otherPlayers = playerRefs.filter((p, i) => i !== masterIndex);
    otherPlayers.forEach(p => {
      p.ref.current.seek(p.ref.current.getCurrentTime() + difference);
    });
  };

  const handleCreateLink = () => {
    let linkText = ``;
    playerRefs.forEach((p, i) => {
      linkText += linkText.length ? "&" : "?";
      linkText += `v${i + 1}=${p.videoId}&t${i +
        1}=${p.ref.current.getCurrentTime().toFixed(2)}`;
    });
    setLinkText(linkText);
  };

  const seekAll = e => {
    e.preventDefault();
    let absoluteValueSeek = seekText;
    let seekBackwards = false;
    console.log("seek all", seekText);
    if (seekText.charAt(0) === "-") {
      seekBackwards = true;
      absoluteValueSeek = seekText.slice(1);
    }
    const absoluteValueSeekFloat = hmsToFloat(absoluteValueSeek);
    if (isNaN(absoluteValueSeekFloat)) {
      // TODO error message state
      console.error(`seek text not a valid format: ${seekText}`);
      return;
    }
    let seekFloat = absoluteValueSeekFloat;
    if (seekBackwards) {
      seekFloat *= -1;
    }
    console.log(
      "seekFloat: ",
      seekFloat,
      seekBackwards ? "backwards" : "forwards"
    );

    playerRefs.forEach(p => {
      p.ref.current.seek(p.ref.current.getCurrentTime() + seekFloat);
    });
  };

  return (
    <div className="App">
      <div className={classes.createLinkContainer}>
        <Button color="primary" onClick={handleCreateLink}>
          Update Link
        </Button>
        {linkText && (
          <LinkCreator
            pathname={`${config.hostname}/archive}`}
            query={linkText}
          />
        )}
      </div>
      <div className={classes.playerGrid}>
        {playerRefs.map(p => (
          <Player
            id={p.queryName}
            key={p.videoId}
            innerRef={p.ref}
            videoId={p.videoId}
            startTime={p.startTime}
            playing={isPlaying}
          />
        ))}
      </div>
      <div className={classes.masterControls}>
        <Button color="primary" onClick={handlePlayClick}>
          Play
          <PlayCircleOutline className={"foo"} />
        </Button>
        <Button color="primary" onClick={handlePauseClick}>
          Pause
          <PauseCircleOutline className={"foo"} />
        </Button>
      </div>
      <div>
        <form className={classes.seekForm} onSubmit={seekAll}>
          <TextField
            value={seekText}
            label="Seek"
            placeholder="-1h25m13.5s"
            onChange={e => setSeekValue(e.target.value)}
          />
          <Button type="submit">Seek</Button>
        </form>
      </div>
      <div className={classes.syncControls}>
        {playerRefs.map((p, i) => (
          <Button onClick={handleSync.bind(this, i)} size="small">
            <Sync />
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default withStyles(styles)(Archive);
