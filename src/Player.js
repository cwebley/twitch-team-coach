import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef
} from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  playerContainer: {
    // width: "50vw"
  }
});

const Player = forwardRef(
  ({ channel, videoId, startTime, playing, classes }, ref) => {
    let player = useRef();

    useImperativeHandle(ref, () => ({
      getCurrentTime() {
        return player.current.getCurrentTime();
      },
      seek(seconds) {
        player.current.seek(seconds);
      }
    }));

    useEffect(() => {
      var options = {
        width: "50%",
        autoplay: false,
        video: videoId
      };
      if (channel) {
        options.channel = channel;
        options.autoplay = true;
        options.muted = true;
      }
      if (startTime) {
        options.time = startTime;
      }

      if (!window.Twitch) {
        console.error("Twitch embed failed to load");
        return;
      }
      player.current = new window.Twitch.Player("player-1", options);
    }, [videoId]);

    useEffect(() => {
      if (!player.current) {
        console.warn("no player reference");
        return;
      }
      if (playing === true) {
        player.current.play();
        return;
      }
      player.current.pause();
    }, [playing]);

    return (
      <div className={"Foo"}>
        <div id="player-1" />
      </div>
    );
  }
);

export default withStyles(styles)(Player);
