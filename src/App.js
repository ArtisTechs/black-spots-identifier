import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavBar } from "./components/NavBar/NavBar";
import SideMenu from "./components/SideMenu/SideMenu";
import MainMapPage from "./pages/MainMapPage/MainMapPage";
import StatisticsPage from "./pages/StatisticsPage/StatisticsPage";
import FileUploadPage from "./pages/FileUploadPage/FileUplaodPage";
import Loader from "./components/Loader/Loader";
import PointStatisticsPage from "./pages/PointStatisticsPage/PointStatisticsPage";

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Router>
      <div className="app">
        <ToastContainer />
        {isLoading && (
          <div className="loading-page">
            <Loader />
          </div>
        )}
        <div className="nav-bar">
          <NavBar />
        </div>
        <div className="main-page">
          <div className="side-menu-page">
            <SideMenu />
          </div>
          <div className="page">
            <Routes>
              <Route path="/" element={<Navigate replace to="/map" />} />
              <Route path="/map" element={<MainMapPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route
                path="/upload"
                element={<FileUploadPage setIsLoading={setIsLoading} />}
              />
              <Route path="*" element={<Navigate to="/map" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
