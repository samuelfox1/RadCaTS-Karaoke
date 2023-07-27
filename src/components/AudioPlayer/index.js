// source: https://codesandbox.io/s/5wwj02qy7k?file=/src/useAudioPlayer.js:0-1246
import React, { useState } from "react";
import useAudioPlayer from "./useAudioPlayer";
import { Container } from "react-materialize";
import AudioBottom from "./AudioBottom";
import KaraokeBox from "../KaraokeBox";
import AudioTop from "./AudioTop";
import "./style.css";

function AudioPlayer({
  sessionData,
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

  return (
    <Container className="center-align">
      <AudioTop sessionData={sessionData} />

      <KaraokeBox
        pts={pts}
        setPts={setPts}
        lyrics={lyrics}
        curTime={curTime}
        duration={duration}
        language={language}
        isPlaying={isPlaying}
        sessionData={sessionData}
        handleFinish={handleFinish}
      />

      <AudioBottom
        pts={pts}
        start={start}
        setStart={setStart}
        hidePlayBtn={hidePlayBtn}
        sessionData={sessionData}
        emitSessionPlayEvent={emitSessionPlayEvent}
      />
    </Container>
  );
}

export default AudioPlayer;
