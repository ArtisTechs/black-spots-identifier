import React, { useState, useEffect } from "react";
import "./Loader.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loader = () => {
  return (
    <div className="loader-container">
      <FontAwesomeIcon
        className="loading-icon"
        icon={faSpinner}
        spin
        size="4x"
      />
      <h1>Loading...</h1>
    </div>
  );
};

export default Loader;
