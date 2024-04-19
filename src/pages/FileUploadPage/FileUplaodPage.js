import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./FileUplaodPage.css";
import { faChartBar, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import DragAndDrop from "../../components/DragAndDrop/DragAndDrop";

const FileUploadPage = ({ setIsLoading }) => {
  const [dataType, setDataType] = useState(null);

  const handleSelectDataType = (type) => {
    setDataType(type);
  };

  const goBack = () => {
    setDataType(null);
  };

  return (
    <div className="main-container-file-upload">
      {dataType ? (
        <div className="drag-and-drop-page">
          <DragAndDrop
            dataType={dataType}
            goBack={goBack}
            setIsLoading={setIsLoading}
          />
        </div>
      ) : (
        <div className="choose-file-page">
          <h1>Select the type of data you'll be uploading.</h1>
          <div className="card-container">
            <div className="card" onClick={() => handleSelectDataType("map")}>
              <FontAwesomeIcon
                className="label-icon-card"
                icon={faLocationDot}
              />
              <p>For Map Screen</p>
            </div>
            <div
              className="card"
              onClick={() => handleSelectDataType("accident")}
            >
              <FontAwesomeIcon className="label-icon-card" icon={faChartBar} />
              <p>For Accident Statistics</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadPage;
