import React from "react";
import { Row, Col } from "react-materialize";
import UserChip from "../UserChip";
import Logout from "../Logout";
import "./style.css";

function Header({ userData, setUserData, setIsPlaying }) {
  const handleHome = () => {
    setIsPlaying(false);
    window.location.href = "/";
  };

  return (
    <div className="header">
      {userData.isLoggedIn ? (
        <Row>
          <Col s={1}>
            {/* TODO: use router element for redirect */}
            <a onClick={handleHome} style={{ cursor: "pointer" }}>
              <h6>Radcats Karaoke</h6>
            </a>
          </Col>
          <Col className="right">
            <Logout
              userData={userData}
              setUserData={setUserData}
              setIsPlaying={setIsPlaying}
            />
            <UserChip userData={userData} />
          </Col>
        </Row>
      ) : null}
    </div>
  );
}

export default Header;
