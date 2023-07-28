import React, { useState, useEffect, useRef } from "react";
import { useParams, Redirect } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";
import MemberCard from "../components/MemberCard";
import { Row, Col, Button } from "react-materialize";
import Header from "../components/Header";
import API from "../utils/API";
import "../App.css";

// Live Session Dependencies
import io from "socket.io-client";

// Live Session Global Constants
const socket = io.connect(process.env.REACT_APP_SOCKET_URL);
// const socket = io.connect("https://radcatskaraokeserver.herokuapp.com") // radcats heroku
// const socket = io.connect("http://radcats-karaoke-server.herokuapp.com")
// const socket = io.connect("http://localhost:3001")
const defaultCopyBtnText = "copy session url (invite a friend to sing along!)";

export default function Session({
  userData,
  setUserData,
  sessionData,
  setSessionData,
  isPlaying,
  setIsPlaying,
}) {
  const [lyrics, setLyrics] = useState({ isLoaded: false });
  const [pts, setPts] = useState(0);
  const { id } = useParams();
  const [copyBtnText, setCopyBtnText] = useState(defaultCopyBtnText);
  const audioRef = useRef(new Audio());

  const handleFinish = () => {
    setIsPlaying(false);

    const localData = JSON.parse(localStorage.getItem("radcatsInfo"));
    const dataObj = { token: localData.token, score: pts };

    API.finishSession(id, dataObj)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const startSession = () => {
    API.startSession(id)
      .then((data) => {
        setSessionData({
          ...sessionData,
          hostId: data.data.host,
          songName: data.data.karaokeSong.name,
          artist: data.data.karaokeSong.artist,
          bucketKey: data.data.karaokeSong.bucketKey,
          sessionId: data.data._id,
          songId: data.data.karaokeSong._id,
          // lyrics: data.data.karaokeLyrics
        });
        let lyricsPath = data.data.karaokeLyrics.lyrics.lines;
        if (lyricsPath) {
          setLyrics({
            lyrics: data.data.karaokeLyrics.lyrics.lines,
            isLoaded: true,
          });
        } else {
          setLyrics({ lyrics: null, isLoaded: true });
        }
      })
      .catch((err) => {
        console.log("session response error", err);
      });
  };

  useEffect(() => {
    startSession();
    if (userData.isLoggedIn) {
      localStorage.removeItem("active-session-url");
    }
  }, []);

  // Live Session - Start

  const [member] = useState(userData);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState();
  const [leaderboard, setLeaderboard] = useState();

  function handlePts(users) {
    users = users.sort((a, b) => (a.pts < b.pts ? 1 : -1));
    setLeaderboard(
      users.map((u) => {
        return (
          <MemberCard
            key={u.userId}
            pfp={u.pfp}
            username={u.username}
            pts={u.pts}
          />
        );
      })
    );
  }

  function emitSessionPlayEvent() {
    socket.emit("play", id, { path: sessionData.bucketKey });
  }

  useEffect(() => {
    if (userData.isLoggedIn) {
      socket.emit(
        "joinSession",
        id,
        member.id,
        member.username,
        member.profilePicture,
        pts,
        (users) => handlePts(users)
      );
    }
  }, [userData]);

  useEffect(() => {
    let timer;
    function receiveMsg(m) {
      let message = m;

      if (isReady) {
        let time = 3;
        setCountdown(time);
        timer = setInterval(() => {
          if (time === 1) {
            time = time - 1;
            setCountdown("Start");
          } else if (time === 0) {
            setCountdown("hide");
            clearInterval(timer);
            setIsPlaying(true);
            setSessionData({ ...sessionData, isActive: true });
            audioRef.current
              .play()
              .then((data) => console.log("audio started"))
              .catch((err) => console.log("audio error", err));
          } else {
            time = time - 1;
            setCountdown(time);
          }
        }, 1000);

        console.log("message", message);
        audioRef.current.src = `${process.env.REACT_APP_S3_BUCKET}/audio${message.path}`;
        console.log("audioRef.current.src", audioRef.current.src);
      }
    }
    socket.on("play", receiveMsg);

    return () => {
      clearInterval(timer);
      socket.off("play", receiveMsg);
    };
  }, [isReady]);

  useEffect(() => {
    socket.emit("points", id, member.id, pts, (users) => handlePts(users));
  }, [pts]);

  useEffect(() => {
    socket.on("leaderboard", handlePts);
  }, [pts]);

  // Live Session - Ends

  const handleShareSession = async () => {
    console.log("clicked");
    await navigator.clipboard.writeText(window.location.href);
    setCopyBtnText("copied!");
    setTimeout(() => {
      setCopyBtnText(defaultCopyBtnText);
    }, 3000);
  };

  const handleRedirect = () => {
    console.log("handleRedirect");
    const url = window.location.href;
    if (url.includes("/session/")) {
      localStorage.setItem("active-session-url", url);
    }

    return <Redirect to="/" />;
  };

  return (
    <div className="pageContents">
      {!userData.isLoggedIn ? (
        handleRedirect()
      ) : (
        <>
          <Header
            userData={userData}
            setUserData={setUserData}
            setIsPlaying={setIsPlaying}
          />
          <Row className="content_row">
            <Col s={12} m={6}>
              <AudioPlayer
                pts={pts}
                audioRef={audioRef}
                isReady={isReady}
                setPts={setPts}
                lyrics={lyrics}
                setIsReady={setIsReady}
                userData={userData}
                isPlaying={isPlaying}
                sessionData={sessionData}
                handleFinish={handleFinish}
                setIsPlaying={setIsPlaying}
                setSessionData={setSessionData}
                emitSessionPlayEvent={emitSessionPlayEvent}
                hidePlayBtn={
                  member.id !== sessionData.hostId ? "none" : "contents"
                }
              />
              <div
                className={
                  countdown === "hide"
                    ? "counter-layer hidden"
                    : "counter-layer"
                }
              >
                {countdown}
              </div>
            </Col>
            <Col s={12} m={6}>
              <h4>Leaderboard</h4>
              <div>{leaderboard}</div>
              {isPlaying === false ? (
                <Button
                  className="ready_button btn_purple"
                  onClick={handleShareSession}
                >
                  {copyBtnText}
                </Button>
              ) : null}
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
