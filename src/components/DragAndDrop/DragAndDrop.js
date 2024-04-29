import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faFile,
  faTimesCircle,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "./DragAndDrop.css";

const DragAndDrop = ({ dataType, goBack, onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      toast.error("Please select a valid Excel file.", {
        position: "top-center",
      });
    } else {
      const file = acceptedFiles[0];

      if (
        file.type !== "application/vnd.ms-excel" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        toast.error("Please select a valid Excel file.", {
          position: "top-right",
        });
      } else {
        setSelectedFile(file);
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  const uploadFile = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <div className="container-drag-drop">
      <div className="drag-and-drop-title">
        <button onClick={goBack} className="back-button">
          <FontAwesomeIcon className="back-button-icon" icon={faAngleLeft} />
        </button>
        {dataType === "map" ? (
          <h1>
            Please upload an Excel file containing the data for Map.
          </h1>
        ) : (
          <h1>
            Please upload an Excel file containing the data for Statistics.
          </h1>
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
