// source: https://codesandbox.io/s/5wwj02qy7k?file=/src/useAudioPlayer.js:0-1246
import { useState, useEffect } from "react";

function useAudioPlayer(setIsPlaying, audioRef) {
  const [duration, setDuration] = useState();
  const [curTime, setCurTime] = useState();

  useEffect(() => {
    const ref = audioRef.current;
    // state setters wrappers
    const setAudioData = () => {
      // console.log("setAudioData");
      setDuration(ref.duration);
      setCurTime(ref.currentTime);
    };

    const setAudioTime = () => {
      // console.log("setAudioTime");
      setCurTime(ref.currentTime);
    };

    // DOM listeners: update React state on DOM events
    ref.addEventListener("loadeddata", setAudioData);
    ref.addEventListener("timeupdate", setAudioTime);
    ref.addEventListener("play", () => setIsPlaying(true));

    // effect cleanup
    return () => {
      // console.log("removeEventListener");
      ref.removeEventListener("loadeddata", setAudioData);
      ref.removeEventListener("timeupdate", setAudioTime);
    };
  }, []);

  return {
    curTime,
    duration,
  };
}

export default useAudioPlayer;
