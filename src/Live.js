import React, { useState, useEffect, useContext, useRef } from "react";
import { RootContext } from "./RootContext";
import "./App.css";
import Button from "@material-ui/core/Button";
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutline from "@material-ui/icons/PauseCircleOutline";
import Player from "./Player.js";
import LinkCreator from "./Link-Creator.js";
import FiberDvrIcon from "@material-ui/icons/FiberDvr";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { hmsToFloat } from "./utils";
import { Link } from "react-router-dom";
import FileCopy from "@material-ui/icons/FileCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import TextField from "@material-ui/core/TextField";
import { withSnackbar } from "notistack";
import config from "./config";

const styles = theme => ({
  masterControls: {
    display: "flex",
    justifyContent: "center"
  },
  playerGrid: {
    maxWidth: "100vh",
    margin: "auto"
  },
  otherControls: {}
});

const fetchUserIdFromChannelName = async (authToken, channel) => {
  const result = await axios(
    `https://api.twitch.tv/helix/users?login=${channel}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }
  );
  if (result.status !== 200) {
    console.error(`failed to fetch user ${channel}`);
    return undefined;
  }
  if (!result.data.data.length) {
    console.error(`channel ${channel} not found`);
    return undefined;
  }
  return result.data.data[0].id;
};

const fetchVideosFromUserId = async (authToken, userId) => {
  const result = await axios(
    `https://api.twitch.tv/helix/videos?user_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }
  );
  if (result.status !== 200) {
    console.error(`failed to fetch videos for user ${userId}`);
    return undefined;
  }
  return result.data.data[0];
};

function Live({ location, classes }) {
  const { authToken } = useContext(RootContext);

  let params = new URLSearchParams(location.search);
  const playerRefs = [];
  [1, 2, 3, 4].forEach(n => {
    if (params.get(`c${n}`)) {
      playerRefs.push({
        ref: useRef(),
        channel: params.get(`c${n}`)
      });
    }
  });

  const [isPlaying, setPlaying] = useState(true);
  const [userIds, setUserIds] = useState([]);
  const [archiveQueryString, setArchiveQueryString] = useState("");

  useEffect(() => {
    if (!authToken) {
      setUserIds([]);
      return;
    }
    const fetchUserIdsFromChannels = async (authToken, playerRefs) => {
      const fetchedUserIds = await Promise.all(
        playerRefs.map(p => fetchUserIdFromChannelName(authToken, p.channel))
      );
      setUserIds(fetchedUserIds);
    };
    fetchUserIdsFromChannels(authToken, playerRefs);
  }, [authToken]);

  const handlePlayClick = () => {
    setPlaying(true);
  };

  const handlePauseClick = () => {
    setPlaying(false);
  };

  const handleArchiveClick = async authToken => {
    const fetchedFirstVids = await Promise.all(
      userIds.map(uid => fetchVideosFromUserId(authToken, uid))
    );
    let queryText = "";
    fetchedFirstVids.forEach((v, i) => {
      queryText += queryText.length ? "&" : "?";
      // set the time 30 seconds before the archives duration
      queryText += `v${i + 1}=${v.id}&t${i + 1}=${hmsToFloat(v.duration) - 30}`;
    });
    setArchiveQueryString(queryText);
  };

  return (
    <div className="App">
      <div className={classes.playerGrid}>
        {playerRefs.map(p => (
          <Player
            key={p.channel}
            id={p.queryName}
            innerRef={p.ref}
            channel={p.channel}
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
      <div className={classes.otherControls}>
        <Button
          disabled={!userIds.length}
          onClick={() => handleArchiveClick(authToken)}
        >
          <FiberDvrIcon />
        </Button>

        {archiveQueryString && (
          <LinkCreator
            pathname={`${config.hostname}/archive}`}
            query={archiveQueryString}
          />
        )}
      </div>
    </div>
  );
}

export default withStyles(styles)(withSnackbar(Live));
