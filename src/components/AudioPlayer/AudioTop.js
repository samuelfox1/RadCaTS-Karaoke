// source: https://codesandbox.io/s/5wwj02qy7k?file=/src/useAudioPlayer.js:0-1246
import React, { useEffect, useState } from "react";
import SongInfo from "./SongInfo";

function AudioTop({ sessionData, audioRef }) {
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    console.log(volume);
    audioRef.current.volume = volume;
  }, [volume, audioRef]);
  return (
    <>
      <div className="row player top">
        <div className="col s12">
          <SongInfo
            songName={sessionData.songName}
            songArtist={sessionData.artist}
          />
        </div>
      </div>
      <div className="row player volume">
        <div className="col s12">
          <span>volume</span>
          <input
            type="range"
            style={{ width: "50%", marginLeft: "1rem" }}
            step={0.01}
            min={0}
            max={1}
            value={volume}
            onInput={(e) => setVolume(Number(e.target.value))}
          />
        </div>
      </div>
    </>
  );
}

export default AudioTop;
