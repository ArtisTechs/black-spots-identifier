import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faArrowLeft,
  faArrowUpFromBracket,
  faBars,
  faChartBar,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import "./SideMenu.css";

const SideMenu = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleMenu = () => {
    setIsMinimized(!isMinimized);
  };

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  return (
    <div className={`side-menu ${isMinimized ? "minimized" : ""}`}>
      <div className={`menu-toggle ${isMinimized ? "minimized" : ""}`}>
        <div className="icon-side-menu" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isMinimized ? faBars : faArrowLeft} />
        </div>
      </div>
      <ul className="menu-items">
        <li>
          <Link
            to="/map"
            className={selectedItem === "map" ? "active" : ""}
            onClick={() => handleItemClick("map")}
          >
            <FontAwesomeIcon className="label-icon" icon={faLocationDot} />
            {!isMinimized && "Map Screen"}
          </Link>
        </li>
        <li>
          <Link
            to="/statistics"
            className={selectedItem === "statistics" ? "active" : ""}
            onClick={() => handleItemClick("statistics")}
          >
            <FontAwesomeIcon className="label-icon" icon={faChartBar} />
            {!isMinimized && "Accident Statistics"}
          </Link>
        </li>
        <li>
          <Link
            to="/upload"
            className={selectedItem === "upload" ? "active" : ""}
            onClick={() => handleItemClick("upload")}
          >
            <FontAwesomeIcon
              className="label-icon"
              icon={faArrowUpFromBracket}
            />
            {!isMinimized && "File Upload"}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;
