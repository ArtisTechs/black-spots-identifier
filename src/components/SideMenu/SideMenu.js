import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import {
  faArrowLeft,
  faArrowUpFromBracket,
  faBars,
  faChartBar,
  faChartColumn,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import "./SideMenu.css";

const SideMenu = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMinimized(!isMinimized);
  };

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  useEffect(() => {
    const pathname = location.pathname;
    switch (pathname) {
      case "/map":
        setSelectedItem("map");
        break;
      case "/statistics":
        setSelectedItem("statistics");
        break;
      case "/upload":
        setSelectedItem("upload");
        break;
      default:
        setSelectedItem(null);
        break;
    }
  }, [location.pathname]);

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
            <FontAwesomeIcon className="label-icon" icon={faChartColumn} />
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
