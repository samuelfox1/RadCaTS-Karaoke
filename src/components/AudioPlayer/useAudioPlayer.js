// source: https://codesandbox.io/s/5wwj02qy7k?file=/src/useAudioPlayer.js:0-1246
import { useState, useEffect } from "react";

function useAudioPlayer(isPlaying, setIsPlaying, audioRef) {
  const [duration, setDuration] = useState();
  const [curTime, setCurTime] = useState();

  useEffect(() => {
    // state setters wrappers
    const setAudioData = () => {
      setDuration(audioRef.current.duration);
      setCurTime(audioRef.current.currentTime);
    };

    const setAudioTime = () => setCurTime(audioRef.current.currentTime);

    // DOM listeners: update React state on DOM events
    audioRef.current.addEventListener("loadeddata", setAudioData);

    audioRef.current.addEventListener("timeupdate", setAudioTime);

    // effect cleanup
    return () => {
      audioRef.current.removeEventListener("loadeddata", setAudioData);
      audioRef.current.removeEventListener("timeupdate", setAudioTime);
    };
  });

  return {
    curTime,
    duration,
    isPlaying,
    setIsPlaying,
  };
}

export default useAudioPlayer;
