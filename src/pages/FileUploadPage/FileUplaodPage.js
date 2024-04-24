import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./FileUplaodPage.css";
import DragAndDrop from "../../components/DragAndDrop/DragAndDrop";
import { faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const FileUploadPage = ({ setIsLoading }) => {
  const [dataType, setDataType] = useState(null);

  const handleSelectDataType = (type) => {
    setDataType(type);
  };

  const goBack = () => {
    setDataType(null);
  };

  const onFileUpload = (file) => {
    setIsLoading(true);
    localStorage.removeItem("uploadedExcelData");

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const requiredColumns = [
        "Date Committed",
        "Time Committed",
        "Latitude",
        "Longitude",
        "Barangay street",
        "Type of vehicle",
        "Vehicle model",
      ];
      const fileColumns = jsonData[0].map((column) => column.toUpperCase());
      const missingColumns = requiredColumns.filter(
        (column) => !fileColumns.includes(column.toUpperCase())
      );

      if (missingColumns.length > 0) {
        setIsLoading(false);
        toast.error(
          `The file is missing the following columns: ${missingColumns.join(
            ", "
          )}`
        );
        return;
      }

      const dataArray = jsonData
        .slice(1)
        .filter((row) => row[2] !== undefined && row[3] !== undefined)
        .map((row) => ({
          dateCommitted: row[0],
          timeCommitted: row[1],
          latitude: row[2],
          longitude: row[3],
          barangayStreet: row[4],
          typeOfVehicle: row[5],
          vehicleModel: row[6],
        }));

      localStorage.setItem("uploadedExcelData", JSON.stringify(dataArray));

      setTimeout(() => {
        setIsLoading(false);
        goBack(false);
        toast.success("File successfully uploaded.");
      }, 1000);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="main-container-file-upload">
      {dataType ? (
        <div className="drag-and-drop-page">
          <DragAndDrop
            dataType={dataType}
            goBack={goBack}
            onFileUpload={onFileUpload}
          />
        </div>
      ) : (
        <div className="choose-file-page">
          <h1>Select the type of data you'll be uploading.</h1>
          <div className="card-container">
            <div className="card" onClick={() => handleSelectDataType("map")}>
              <FontAwesomeIcon className="label-icon-card" icon={faFileExcel} />
              <p>Excel File</p>
            </div>
            {/* <div
              className="card"
              onClick={() => handleSelectDataType("accident")}
            >
              <FontAwesomeIcon
                className="label-icon-card"
                icon={faChartBar}
              />
              <p>For Accident Statistics</p>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadPage;
