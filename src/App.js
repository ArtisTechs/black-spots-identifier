import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { NavBar } from "./components/NavBar/NavBar";
import SideMenu from "./components/SideMenu/SideMenu";
import MainMapPage from "./pages/MainMapPage/MainMapPage";
import StatisticsPage from "./pages/StatisticsPage/StatisticsPage";
import FileUplaodPage from "./pages/FileUploadPage/FileUplaodPage";

function App() {
  return (
    <Router>
      <div className="app">
        <div className="nav-bar">
          <NavBar />
        </div>
        <div className="main-page">
          <div className="side-menu-page">
            <SideMenu />
          </div>
          <div className="page">
            <Routes>
              <Route path="/map" element={<MainMapPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/upload" element={<FileUplaodPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
