import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { NavBar } from "./components/NavBar/NavBar";
import SideMenu from "./components/SideMenu/SideMenu";

function App() {
  return (
    <Router>
      <div className="app">
        <div className="nav-bar">
          <NavBar />
        </div>
        <div className="main-page">
          <SideMenu />
        </div>
      </div>
    </Router>
  );
}

export default App;
