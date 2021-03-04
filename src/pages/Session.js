import React, { useState, useEffect } from 'react';
import { useParams, Redirect } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";
import MemberCard from "../components/MemberCard";
import { Button, Row, Col } from "react-materialize";
import Header from "../components/Header";
import API from "../utils/API";
import "../App.css"

// Live Session Dependencies
import io from "socket.io-client"

// Live Session Global Constants 
const socket = io.connect("http://localhost:3001")
// const socket = io.connect("http://radcats-karaoke-server.herokuapp.com")
const audio = new Audio()

export default function Session({ userData, setUserData, sessionData, setSessionData, isPlaying, setIsPlaying }) {

    const { id } = useParams()
    // const [sessionData, setSessionData] = useState()

    const handleFinish = () => {
        // setIsPlaying(false) 
        console.log('finish') // send PUT request to /api/session/:id
    }

    const startSession = () => {
        API.startSession(id)
            .then((data) => {
                console.log("sessionAPIcall", data)
                setSessionData({
                    ...sessionData,
                    hostId: data.data.host,
                    songName: data.data.karaokeSong.name,
                    artist: data.data.karaokeSong.artist,
                    mixed: data.data.karaokeSong.mixed,
                    sessionId: data.data._id,
                    songId: data.data.karaokeSong._id,
                    lyrics: data.data.karaokeLyrics
                })
                // data.data.karaokeSong.mixed;
            })
            .catch(err => {
                console.log('session response error', err)
            })
    }

    useEffect(() => {
        console.log('startSession', id)
        startSession();
    }, [])

    // Live Session - Start

    const [member, setMember] = useState(userData)
    const [allMembers, setAllMembers] = useState([])
    const [start, setStart] = useState(false)
    const [countdown, setCountdown] = useState()
    const [leaderboard, setLeaderboard] = useState()
    const [pts, setPts] = useState(0)

    console.log("member", member)
    console.log("userData", userData)

    function handleNewMembers(users) {
        setAllMembers(users)
        setLeaderboard(users.map(u => {
            return <MemberCard
                key={u.userId}
                pfp={u.pfp}
                username={u.username}
                pts={u.pts}
            />
        }
        ))
    }

    function handlePlaySound() {
        console.log("handleplaysound")
        console.log(sessionData.mixed)
        socket.emit("start", id, { path: sessionData.mixed })
    }

    useEffect(() => {
        socket.emit("joinSession",
            id,
            member.id,
            member.username,
            member.profilePicture,
            pts,
            (users) => handleNewMembers(users)
        )
    }, [userData])

    useEffect(() => {
        function recieveMsg(m) {
            console.log("recieved msg", m)
            console.log(start)
            if (start) {
                let time = 3
                setCountdown(time)
                const timer = setInterval(() => {
                    console.log(time)
                    if (time === 1) {
                        // clearInterval(timer)
                        time = time - 1
                        setCountdown("Start")
                    } else if (time === 0) {
                        clearInterval(timer)
                        setCountdown("hide")
                    } else {
                        time = time - 1
                        setCountdown(time)
                    }
                }, 1000)
                setTimeout(() => {
                    audio.src = m.path
                    audio.play()
                }, 5000)
            }
        }
        socket.on("play", recieveMsg)

        return () => {
            socket.off("play", recieveMsg)
        }
    }, [start])

    // Live Session - Ends

    return (
        <div className="pageContents">
            {!userData.isLoggedIn ?
                <Redirect to="/" />
                :
                <>
                    {console.log(sessionData)}
                    < Header userData={userData} setUserData={setUserData} />
                    <Row style={{ marginTop: "5%" }}>
                        {console.log(start)}
                        <Col s={12} m={6}>
                            <AudioPlayer
                                isPlaying={isPlaying}
                                setIsPlaying={setIsPlaying}
                                sessionData={sessionData}
                                userData={userData}
                                handlePlaySound={handlePlaySound}
                                setStart={setStart}
                                audio={audio}
                            />
                            <div className={countdown === "hide" ? "counter-layer hidden" : "counter-layer"}>
                                {countdown}
                            </div>
                            <Button onClick={handleFinish}>Finish</Button>
                        </Col>
                        <Col s={12} m={6}>
                            <h4>Leaderboard</h4>
                            {console.log("session", sessionData)}
                            <div>
                                {leaderboard}
                            </div>
                        </Col>
                    </Row>

                </>
            }
        </div>
    )
}