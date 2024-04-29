import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./FileUplaodPage.css";
import DragAndDrop from "../../components/DragAndDrop/DragAndDrop";
import { faChartBar, faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import {
  faChartColumn,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";

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
    let localStorageKey;

    if (dataType === "map") {
      localStorageKey = "uploadedExcelDataForMap";
    } else if (dataType === "accident") {
      localStorageKey = "uploadedExcelDataForAccident";
    } else {
      setIsLoading(false);
      toast.error("Invalid data type selected.");
      return;
    }

    localStorage.removeItem(localStorageKey);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Assuming your required columns differ for map and accident data
      const requiredColumnsMap = [
        "Date Committed",
        "Time Committed",
        "Latitude",
        "Longitude",
        "Barangay street",
        "Type of vehicle",
        "Vehicle model",
      ];
      const requiredColumnsAccident = [
        "Year",
        "A-B",
        "B-C",
        "C-D",
        "E-F",
        "F-G",
        "G-H",
        "H-I",
        "I-J",
        "J-K",
      ];

      const requiredColumns =
        dataType === "map" ? requiredColumnsMap : requiredColumnsAccident;

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

      let dataArray;

      if (dataType === "accident") {
        dataArray = jsonData
          .slice(1)
          .filter((row) => row[2] !== undefined && row[3] !== undefined)
          .map((row) => ({
            year: row[0],
            "Point A-B": row[1],
            "Point B-C": row[2],
            "Point C-D": row[3],
            "Point D-E": row[4],
            "Point E-F": row[5],
            "Point F-G": row[6],
            "Point G-H": row[7],
            "Point H-I": row[8],
            "Point I-J": row[9],
            "Point J-K": row[10],
          }));
      } else {
        dataArray = jsonData
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
      }

      localStorage.setItem(localStorageKey, JSON.stringify(dataArray));

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
              <FontAwesomeIcon
                className="label-icon-card"
                icon={faMapLocationDot}
              />
              <p>For Map</p>
            </div>
            <div
              className="card"
              onClick={() => handleSelectDataType("accident")}
            >
              <FontAwesomeIcon
                className="label-icon-card"
                icon={faChartColumn}
              />
              <p>For Accident Statistics</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadPage;
