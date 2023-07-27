import React, { useEffect, useState } from "react";
import "./style.css";

function LyricsContainer({
  curTime,
  isPlaying,
  lyrics,
  pts,
  setPts,
  userInput,
  duration,
  handleFinish,
}) {
  const [index, setIndex] = useState(0); // track the index location of the current lyrics object
  const [activeLyrics, setActiveLyrics] = useState({
    time: 0,
    text: "welcome!",
  }); // container for the previous lyric object to check for pts
  const [stagedLyrics, setStagedLyrics] = useState({
    time: 0,
    text: "click play or click ready if joined with session link",
  }); // container for the current index lyric object
  const [lyricList, setLyricList] = useState([]);
  const [ptsIdx, setPtsIdx] = useState({ idx: 1 });

  useEffect(() => {
    if (lyrics.lyrics?.length) {
      setLyricList(lyrics.lyrics);
      console.log("lyrics.lyrics", lyrics.lyrics);
    }
  }, [lyrics.isLoaded]);

  useEffect(() => {
    const time = Math.floor(curTime);
    const songLength = Math.floor(duration);
    const stagedLyricsStartTime = Math.floor(stagedLyrics.time);

    const targetActive = lyricList[index] || { test: "targetActive" };
    const targetStaged = lyricList[index + 1] || { test: "targetStaged" };

    if (time === songLength && isPlaying) {
      handleFinish();
      return;
    }

    if (lyrics.isLoaded && lyricList.length) {
      if (index === lyricList.length) {
        setActiveLyrics({ text: "End lyrics" });
        setStagedLyrics({ text: "Thanks for playin'" });
      } else if (time === 0) {
        // if session is active and time is 0, start the first set of lyrics)
        setActiveLyrics({ text: "(get ready!)" });
        setStagedLyrics(targetActive);
        // if session is active & time matches the time of the next object, access the nested conditional.
      } else if (time === stagedLyricsStartTime) {
        setActiveLyrics(targetActive);
        setStagedLyrics(targetStaged);
        setIndex((c) => c + 1);
      }
    }
  }, [lyrics.isLoaded, isPlaying, curTime, lyricList, index]);

  // update points based on new user input
  // make sure there are entries from user to avoid errors
  // create array of words from user input
  // concatenate the current lyrics with the last lyrics, check if any user input matches any words

  useEffect(() => {
    console.log("userInput", userInput);
    if (userInput.length > 1 && lyricList.length) {
      const microphoneInput = userInput[userInput.length - 2].text.split(" ");
      const micInputEndTime = userInput[userInput.length - 1].time;
      var points = pts;

      var possibleLyrics = [];
      var idxIncrement = 0;

      lyricList.map((line, idx) => {
        // where to start looking for lyrics
        if (idx >= ptsIdx.idx) {
          // where to stop looking
          if (line.time < micInputEndTime) {
            idxIncrement++;
            let words = line.text.split(" ");
            words.map((x) => {
              possibleLyrics.push(x);
            });
          }
        }
      });

      setPtsIdx({ idx: idxIncrement });

      console.log(possibleLyrics);
      console.log(microphoneInput);

      // Possible solution to "cheat" issue with repeated words racking up points.
      // Test when Chomie and Rita have sessions working.
      possibleLyrics.map((word) => {
        let index = microphoneInput.indexOf(word);
        if (index > -1) {
          console.log(
            `Matched: ${word} === ${microphoneInput[index]} || Points: ${
              points + 1
            }`
          );
          microphoneInput.splice(index, 1);
          points++;
        }
      });

      setPts(points);
    }
  }, [userInput]);

  return (
    <div className="center-align">
      <div className="row">
        <h4 className="center-align">{activeLyrics?.text || "Have fun!"}</h4>
      </div>

      <div className="divider"></div>

      <div className="row">
        <h6 className="muted">
          {stagedLyrics?.text || "🎤 earn points by adding lyrics 🎤"}
        </h6>
      </div>
    </div>
  );
}

export default LyricsContainer;
