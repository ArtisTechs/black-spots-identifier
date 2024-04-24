import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet.heat";
import "./MainMapPage.css";
import * as geolib from "geolib";

const MainMapPage = () => {
  const [map, setMap] = useState(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const leafletMap = L.map(mapContainerRef.current).setView(
      [15.049528, 120.69425],
      13
    );
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      leafletMap
    );

    const uploadedData = localStorage.getItem("uploadedExcelData");
    const data = uploadedData ? JSON.parse(uploadedData) : [];

    // Step 1: Combine nearby data into the center based on its coordinates
    const combinedData = data.reduce((acc, current) => {
      // Check if the current location is close to an existing location
      const existing = acc.find((item) =>
        geolib.isPointWithinRadius(
          { latitude: item.center.latitude, longitude: item.center.longitude },
          {
            latitude: parseFloat(current.latitude),
            longitude: parseFloat(current.longitude),
          },
          120
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

    const circles = Array.isArray(combinedData)
      ? combinedData
          .filter(
            (item) =>
              isValidCoordinate(item.center.latitude) &&
              isValidCoordinate(item.center.longitude)
          )
          .map((item) => {
            // Calculate the radius based on the total number of accidents
            const radius =
              item.totalData < 20
                ? 50
                : item.totalData >= 20
                ? 100
                : item.totalData > 150
                ? 150
                : item.totalData;

            const circle = L.circle(
              [item.center.latitude, item.center.longitude],
              {
                radius: radius,
                stroke: false,
                fillOpacity: 0,
              }
            );

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

    circles.forEach((circle) => circle.addTo(leafletMap));

    leafletMap.addControl(new L.Control.Fullscreen());

    setMap(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, []);

  function isValidCoordinate(coord) {
    return typeof coord === "number" && !isNaN(coord);
  }

  return (
    <div className="main-container">
      <div className="map-container">
        <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
      </div>
    </div>
  );
};

export default MainMapPage;
