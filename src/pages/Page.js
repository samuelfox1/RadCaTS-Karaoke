import React, { useEffect, useState } from "react";
import API from "../utils/API";
import Header from "../components/Header";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import Logout from "../components/Logout";
import Search from "../components/Search";
import FileDrop from "../components/FileDrop";
import Preloader from "../components/Preloader";
import AudioPlayer from "../components/AudioPlayer";


function Page( { setSessionData, sessionData } ) {

  const [search, setSearch] = useState([])
  const [userData, setUserData] = useState({
    id: "",
    token: "",
    username: "",
    isLoggedIn: false,
    profilePicture: ""
  })
  const [display, setDisplay] = useState({
    audioPlayer: false,
    fileDrop: false,
    loading: false,
    logout: false,
    search: false,
    signInBtns: false
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      API.checkWebToken(token)
        .then(res => { loginSuccess(res) })
        .catch(err => { logoutUser(err) })
    } else { userLoginPage() }


  }, [])

  const userLoginPage = () => {
    setDisplay({
      ...display,
      audioPlayer: false,
      signInBtns: true,
      loading: false,
      search: false,
      logout: false
    })
  }

  const loginSuccess = (res) => {
    console.log(res)
    localStorage.setItem("token", res.data.token)
    setDisplay({
      ...display,
      signInBtns: false,
      loading: false,
      search: true,
      logout: true
    })
    setUserData({
      isLoggedIn: true,
      id: res.data.user._id,
      token: res.data.token,
      username: res.data.user.username,
      profilePicture: res.data.user.profilePicture
    })

    API.getAllSongs()
      .then(data => {
        setSessionData(data.data)
        formatAutoComplete(data.data)
      })
      .catch(err => { console.error(err) })
  }

  const logoutUser = (err) => {
    console.error('Logged out')
    // localStorage.removeItem("token");
    if (err) { console.log(err) };
    userLoginPage()
    setUserData({
      isLoggedIn: false,
      email: '',
      token: '',
      id: ''
    })
  }

  const formatAutoComplete = (data) => {
    const formatted = []
    data.map(song => {
      let obj = {
        label: `${song.name} - ${song.artist}`,
        value: song._id
      }
      formatted.push(obj)
    })

    setSearch(formatted)
  }


  return (

    <div className="App center-align">
      <Header userData={userData} />

      {display.signInBtns
        ? <>
          <SignUp
            display={display}
            setDisplay={setDisplay}
            loginSuccess={loginSuccess}
            logoutUser={logoutUser}
          />
          <SignIn
            display={display}
            setDisplay={setDisplay}
            loginSuccess={loginSuccess}
            logoutUser={logoutUser}
          />
        </>
        : null}

      {display.loading ? <Preloader /> : null}

      {display.search
        ? <Search
          search={search}
          display={display}
          userData={userData}
          sessionData={sessionData}
          setDisplay={setDisplay}
          setSessionData={setSessionData}
        />
        : null
      }

      {display.audioPlayer
        ? <AudioPlayer
          display={display}
          userData={userData}
          sessionData={sessionData}
          setDisplay={setDisplay}
        />
        : null
      }

      {display.logout
        ? <Logout
          display={display}
          userData={userData}
          setDisplay={setDisplay}
          logoutUser={logoutUser}
        />
        : null}

      {display.fileDrop ? <FileDrop /> : null}

    </div>
  );
}

export default Page;