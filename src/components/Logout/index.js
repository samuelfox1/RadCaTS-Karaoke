import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Modal, Button } from "react-materialize";
import "./style.css";

const trigger = (
  <Button className="logout_button btn_purple">
    <i className="material-icons">exit_to_app</i>
  </Button>
);

export default function Logout({ userData, setUserData }) {
  const [redirect, setRedirect] = useState("");

  // remove token from local storage
  // reset userData
  const logoutUser = () => {
    setRedirect(<Redirect to="/" />);
    localStorage.removeItem("radcatsInfo");
    setUserData({});
  };

  return (
    <>
      {redirect}
      <Modal
        trigger={trigger}
        className="center-align"
        header={`logout ${userData.username}?`}
      >
        <Button className="btn_purple" modal="close" onClick={logoutUser}>
          logout
        </Button>
      </Modal>
    </>
  );
}
