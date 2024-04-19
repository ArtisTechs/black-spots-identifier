import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faTimes,
  faAngleLeft,
  faFile,
  faTimesCircle,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import "./DragAndDrop.css";

const DragAndDrop = ({ dataType, goBack, setIsLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    // Handle dropped files
    setSelectedFile(acceptedFiles[0]);
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  const uploadFile = () => {
    console.log("Uploading file:", selectedFile.name);

    // Set loading state to true
    setIsLoading(true);

    // Simulate a delay for demonstration purposes
    setTimeout(() => {
      // Set loading state to false after 2 seconds
      setIsLoading(false);
      goBack(false);
    }, 2000);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="container-drag-drop">
      <div className="drag-and-drop-title">
        <button onClick={goBack} className="back-button">
          <FontAwesomeIcon className="back-button-icon" icon={faAngleLeft} />
        </button>
        {dataType === "map" ? (
          <h1>Upload an Excel file containing the data for Map.</h1>
        ) : (
          <h1>Upload an Excel file containing the data for Statistics.</h1>
        )}
      </div>
      <div {...getRootProps()} className="drag-and-drop-space">
        <input {...getInputProps()} />
        {selectedFile ? (
          <div className="drag-and-drop-space-center">
            <div className="selected-icon">
              <div className="clear-button-container">
                <button
                  onClick={clearFile}
                  className="clear-button"
                  title="Clear Selected"
                >
                  <FontAwesomeIcon
                    className="clear-icon"
                    icon={faTimesCircle}
                  />
                </button>
              </div>
              <FontAwesomeIcon className="uploaded-icon" icon={faFile} />
            </div>
            <p>File selected: {selectedFile.name}</p>
          </div>
        ) : (
          <div>
            <FontAwesomeIcon className="cloud-arrow-up" icon={faCloudArrowUp} />
            <p>Drag and drop an Excel file here</p>
            <p>or</p>
            <button className="browse-file-button">Browse Files</button>
          </div>
        )}
      </div>
      {selectedFile && (
        <button onClick={uploadFile} className="upload-button">
          Upload File
        </button>
      )}
    </div>
  );
};

export default DragAndDrop;
