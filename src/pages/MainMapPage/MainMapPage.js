  import React, { useEffect, useRef, useState } from "react";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import "leaflet-fullscreen";
  import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
  import "leaflet.heat";
  import "./MainMapPage.css";
  import * as geolib from "geolib";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faCircle, faCircleXmark } from "@fortawesome/free-regular-svg-icons";

  const MainMapPage = () => {
    const [map, setMap] = useState(null);
    const [selectedYear, setSelectedYear] = useState(
      localStorage.getItem("selectedYearMap") || "All Years"
    );
    // const [showStrokes, setShowStrokes] = useState(
    //   localStorage.getItem("showStrokesMap") || false
    // );
    const mapContainerRef = useRef(null);
    const [data, setData] = useState([]);
    const [filteredDataByYear, setFilteredDataByYear] = useState({});
    const [displayedData, setDisplayedData] = useState([]);
    const fullscreenControlRef = useRef(null);

    useEffect(() => {
      const leafletMap = L.map(mapContainerRef.current).setView(
        [15.049528, 120.69425],
        13
      );

      const uploadedData = localStorage.getItem("uploadedExcelDataForMap");
      const data = uploadedData ? JSON.parse(uploadedData) : [];
      setData(data);

      const filteredDataByYear = {};
      data.forEach((item) => {
        const date = new Date(item.dateCommitted);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          if (!filteredDataByYear[year]) {
            filteredDataByYear[year] = [];
          }
          filteredDataByYear[year].push(item);
        }
      });

      setFilteredDataByYear(filteredDataByYear);

      setMap(leafletMap);

      return () => {
        leafletMap.remove();
      };
    }, []);

    useEffect(() => {
      if (selectedYear === "All Years") {
        setDisplayedData(data); // If "All Years" selected, display all data
      } else {
        setDisplayedData(filteredDataByYear[selectedYear] || []); // Display data for selected year
      }
    }, [selectedYear, filteredDataByYear, data]);

    useEffect(() => {
      if (map) {
        // localStorage.setItem("showStrokesMap", showStrokes);
        setupMapLayers(map, displayedData);
      }
    }, [map, displayedData]); // Include showStrokes in the dependencies array

    useEffect(() => {
      localStorage.setItem("selectedYearMap", selectedYear);
    }, [selectedYear]);

    function isValidCoordinate(coord) {
      return typeof coord === "number" && !isNaN(coord);
    }

    const setupMapLayers = (leafletMap, data) => {
      // Clear existing layers
      leafletMap.eachLayer((layer) => {
        if (!layer._url) {
          leafletMap.removeLayer(layer);
        }
      });

      // Add tile layer
      L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        leafletMap
      );

      // Add fullscreen control to the map
      if (!fullscreenControlRef.current) {
        fullscreenControlRef.current = new L.Control.Fullscreen();
        leafletMap.addControl(fullscreenControlRef.current);
      }

      // Step 1: Combine nearby data into the center based on its coordinates
      const combinedData = data.reduce((acc, current) => {
        // Check if the current location is close to an existing location
        const existing = acc.find((item) =>
          geolib.isPointWithinRadius(
            {
              latitude: item.center.latitude,
              longitude: item.center.longitude,
            },
            {
              latitude: parseFloat(current.latitude),
              longitude: parseFloat(current.longitude),
            },
            250
          )
        );

        if (existing) {
          // Increment the total number of accidents at this location
          existing.totalData++;

          // Update the latest date and time of the accident
          existing.latestDateCommitted = current.dateCommitted;
          existing.latestTimeCommitted = current.timeCommitted;

          // Add the barangay street if it's not already included
          if (!existing.barangayStreets.includes(current.barangayStreet)) {
            existing.barangayStreets.push(current.barangayStreet);
          }

          // Update typeOfVehicles counts if the type is not 'n/a'
          if (current.typeOfVehicle !== "n/a") {
            if (existing.typeOfVehicles[current.typeOfVehicle]) {
              existing.typeOfVehicles[current.typeOfVehicle]++;
            } else {
              existing.typeOfVehicles[current.typeOfVehicle] = 1;
            }
          }

          // Update vehicleModels counts if the model is not 'n/a'
          if (current.vehicleModel !== "n/a") {
            if (existing.vehicleModels[current.vehicleModel]) {
              existing.vehicleModels[current.vehicleModel]++;
            } else {
              existing.vehicleModels[current.vehicleModel] = 1;
            }
          }

          // Get top 3 typeOfVehicles excluding 'n/a'
          existing.topTypeOfVehicles = Object.entries(existing.typeOfVehicles)
            .filter(([type]) => type !== "n/a")
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([type]) => type);

          // Get top 3 vehicleModels excluding 'n/a'
          existing.topVehicleModels = Object.entries(existing.vehicleModels)
            .filter(([model]) => model !== "n/a")
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([model]) => model);
        } else {
          // Create a new entry for this location if it doesn't exist
          acc.push({
            center: {
              latitude: parseFloat(current.latitude),
              longitude: parseFloat(current.longitude),
            },
            totalData: 1,
            latestDateCommitted: current.dateCommitted,
            latestTimeCommitted: current.timeCommitted,
            barangayStreets: [current.barangayStreet],
            typeOfVehicles:
              current.typeOfVehicle !== "n/a"
                ? { [current.typeOfVehicle]: 1 }
                : {},
            vehicleModels:
              current.vehicleModel !== "n/a" ? { [current.vehicleModel]: 1 } : {},
            topTypeOfVehicles:
              current.typeOfVehicle !== "n/a" ? [current.typeOfVehicle] : [],
            topVehicleModels:
              current.vehicleModel !== "n/a" ? [current.vehicleModel] : [],
          });
        }
        return acc;
      }, []);

      // Filter combinedData to exclude items with totalData less than or equal to 5
      const filteredCombinedData = combinedData.filter(
        (item) => item.totalData > 5
      );

      // Add circles to the map
      const circles = Array.isArray(filteredCombinedData)
        ? filteredCombinedData
            .filter(
              (item) =>
                isValidCoordinate(item.center.latitude) &&
                isValidCoordinate(item.center.longitude)
            )
            .map((item) => {
              const circle = L.circle(
                [item.center.latitude, item.center.longitude],
                {
                  radius: 250,
                  stroke: false, // Use the state to control visibility
                  fillOpacity: 0,
                }
              );

              // Set up popup content
              const popupContent = `
              <b>Summary</b><hr>
              <b>Total Accidents:</b> ${item.totalData}<br>
              <b>Barangay Street(s):</b><br> ${
                item.barangayStreets.length > 0
                  ? item.barangayStreets.join(", ")
                  : "N/A"
              }<br>
              <b>Most recent recorded incident:</b><br> ${
                item.latestDateCommitted
                  ? item.latestDateCommitted + " at " + item.latestTimeCommitted
                  : "N/A"
              }<br>
              <b>Common Vehicle Types Involved:</b><br> (${
                item.topTypeOfVehicles.length > 0
                  ? item.topTypeOfVehicles.join("), (")
                  : "N/A"
              })<br>
              <b>Common Vehicle Models Involved:</b><br> (${
                item.topVehicleModels.length > 0
                  ? item.topVehicleModels.join("), (")
                  : "N/A"
              })<br><br>
            `;

              // Bind popup and event listeners
              circle.bindPopup(popupContent);
              circle.on("mouseover", function (e) {
                this.openPopup();
              });
              circle.on("mouseout", function (e) {
                this.closePopup();
              });

              return circle;
            })
        : [];

      // Add circles to the map
      circles.forEach((circle) => circle.addTo(leafletMap));

      // Add heatmap layer to the map
      const heatmapData = data
        .filter(
          (item) =>
            isValidCoordinate(item.latitude) && isValidCoordinate(item.longitude)
        )
        .map((item) => [parseFloat(item.latitude), parseFloat(item.longitude)]);

      const heat = L.heatLayer(heatmapData, {
        radius: 15,
        gradient: {
          0.1: "blue",
          0.2: "cyan",
          0.3: "lime",
          0.4: "yellow",
          0.5: "red",
        },
      }).addTo(leafletMap);
    };

    return (
      <div className="main-container">
        <div className="map-container">
          <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
          <div className="dropdown-container">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="All Years">All Years</option>
              {Object.keys(filteredDataByYear).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="legend-window">
              <h1>Legend</h1>
              <div className="legend-item">
                <div className="circle" style={{ background: "red" }}></div>
                <p>High Accident Frequency</p>
              </div>
              <div className="legend-item">
                <div className="circle" style={{ background: "yellow" }}></div>
                <p>Medium Accident Frequency</p>
              </div>
              <div className="legend-item">
                <div className="circle" style={{ background: "lime" }}></div>
                <p>Low Accident Frequency</p>
              </div>
            </div>
          </div>
          {/* <button
            onClick={() => setShowStrokes((prev) => !prev)}
            className="show-circles-button"
          >
            <FontAwesomeIcon icon={showStrokes ? faCircleXmark : faCircle} />
          </button> */}
        </div>
      </div>
    );
  };

  export default MainMapPage;
