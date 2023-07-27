// source: https://codesandbox.io/s/5wwj02qy7k?file=/src/useAudioPlayer.js:0-1246
import React, { useState } from "react";
import useAudioPlayer from "./useAudioPlayer";
import { Container } from "react-materialize";
import AudioBottom from "./AudioBottom";
import KaraokeBox from "../KaraokeBox";
import AudioTop from "./AudioTop";
import moment from "moment";
import "./style.css";

function AudioPlayer({
  sessionData,
  setSessionData,
  isPlaying,
  setIsPlaying,
  handleFinish,
  emitSessionPlayEvent,
  start,
  setStart,
  audioRef,
  pts,
  setPts,
  lyrics,
  hidePlayBtn,
}) {
  const { curTime, duration } = useAudioPlayer(setIsPlaying, audioRef);
  const [language] = useState("en-Us");

  const formatDuration = (duration) => {
    return moment
      .duration(duration, "seconds")
      .format("mm:ss", { trim: false });
  };

  const handlePlay = () => {
    setSessionData({ ...sessionData, isActive: true });
    setIsPlaying(true);
  };
  // const handleStop = () => {
  //   setIsPlaying(false);
  // };

  return (
    <Container className="center-align">
      <AudioTop sessionData={sessionData} />

      <KaraokeBox
        pts={pts}
        lyrics={lyrics}
        setPts={setPts}
        curTime={curTime}
        isPlaying={isPlaying}
        handleFinish={handleFinish}
        duration={duration}
        language={language}
        sessionData={sessionData}
      />

      <AudioBottom
        pts={pts}
        handlePlay={handlePlay}
        emitSessionPlayEvent={emitSessionPlayEvent}
        start={start}
        setStart={setStart}
        hidePlayBtn={hidePlayBtn}
        sessionData={sessionData}
      />
    </Container>
  );
}

export default AudioPlayer;
