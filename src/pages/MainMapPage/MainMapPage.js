import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet.heat";
// import markerPin from "../../assets/icons/pin.png";
import "./MainMapPage.css";

const MainMapPage = () => {
  const [map, setMap] = useState(null);
  // const [showMarkers, setShowMarkers] = useState(true); 
  const mapContainerRef = useRef(null);
  // const markersRef = useRef([]);

  useEffect(() => {
    const leafletMap = L.map(mapContainerRef.current).setView(
      [15.049528, 120.69425],
      13
    );
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      leafletMap
    );

    /*const customIcon = L.icon({
      iconUrl: markerPin,
      iconSize: [30, 45],
      iconAnchor: [15, 45],
      popupAnchor: [0, -45],
    });*/

    const data = [
      {
        date: "2023-01-05",
        time: "16:30:00",
        latitude: 15.039543,
        longitude: 120.681084,
        barangay: "Dolores",
        vehicleType: "CAR",
        vehicleModel: "MITSUBISHI",
      },
      {
        date: "2023-01-05",
        time: "10:13:00",
        latitude: 15.043024,
        longitude: 120.686966,
        barangay: "Dolores",
        vehicleType: "WAGON",
        vehicleModel: "TOYOTA",
      },
      {
        date: "2023-01-12",
        time: "15:00:00",
        latitude: 15.020808,
        longitude: 120.676575,
        barangay: "San Juan",
        vehicleType: "VAN",
        vehicleModel: "TOYOTA",
      },
      {
        date: "2023-01-15",
        time: "23:20:00",
        latitude: 15.021223,
        longitude: 120.676537,
        barangay: "San Juan",
        vehicleType: "CAR",
        vehicleModel: "TOYOTA",
      },
      {
        date: "2023-01-16",
        time: "11:30:00",
        latitude: 15.043314,
        longitude: 120.686493,
        barangay: "Dolores",
        vehicleType: "WAGON",
        vehicleModel: "TOYOTA",
      },
      {
        date: "2023-01-16",
        time: "16:00:00",
        latitude: 15.040164,
        longitude: 120.699539,
        barangay: "San Jose",
        vehicleType: "WAGON",
        vehicleModel: "HYUNDAI",
      },
    ];

    const newData = [
      {
        date: "2023-07-31",
        time: "13:45:00",
        latitude: 15.04377,
        longitude: 120.688698,
        barangay: "San Jose",
        vehicleType: "TRUCK",
        vehicleModel: "n/a",
      },
      {
        date: "2023-07-31",
        time: "15:10:00",
        latitude: 15.041242,
        longitude: 120.685249,
        barangay: "Dolores",
        vehicleType: "WAGON",
        vehicleModel: "n/a",
      },
      {
        date: "2023-08-05",
        time: "15:00:00",
        latitude: 15.044039,
        longitude: 120.68795,
        barangay: "Dolores",
        vehicleType: "TRUCK",
        vehicleModel: "HINO",
      },
      {
        date: "2023-08-05",
        time: "22:00:00",
        latitude: 15.02143,
        longitude: 120.677223,
        barangay: "San Juan",
        vehicleType: "TRUCK",
        vehicleModel: "n/a",
      },
      {
        date: "2023-08-07",
        time: "14:50:00",
        latitude: 15.037823,
        longitude: 120.679199,
        barangay: "Dolores",
        vehicleType: "CAR",
        vehicleModel: "n/a",
      },
      {
        date: "2023-08-08",
        time: "10:15:00",
        latitude: 15.042361,
        longitude: 120.701576,
        barangay: "San Jose",
        vehicleType: "WAGON",
        vehicleModel: "n/a",
      },
      {
        date: "2023-08-08",
        time: "12:20:00",
        latitude: 15.024062,
        longitude: 120.671707,
        barangay: "Dolores",
        vehicleType: "VAN",
        vehicleModel: "n/a",
      },
      {
        date: "2023-08-08",
        time: "12:30:00",
        latitude: 15.0263,
        longitude: 120.669647,
        barangay: "Magliman",
        vehicleType: "WAGON",
        vehicleModel: "n/a",
      },
      {
        date: "2023-08-08",
        time: "11:30:00",
        latitude: 15.024974,
        longitude: 120.670723,
        barangay: "Magliman",
        vehicleType: "CAR",
        vehicleModel: "n/a",
      },
      {
        date: "2023-08-08",
        time: "17:30:00",
        latitude: 15.04176,
        longitude: 120.684235,
        barangay: "Dolores",
        vehicleType: "TRUCK",
        vehicleModel: "n/a",
      },
      {
        date: "2023-08-08",
        time: "18:30:00",
        latitude: 15.046215,
        longitude: 120.692474,
        barangay: "San Jose",
        vehicleType: "WAGON",
        vehicleModel: "n/a",
      },
      {
        date: "2023-08-16",
        time: "14:20:00",
        latitude: 15.080818,
        longitude: 120.640617,
        barangay: "Sindalan",
        vehicleType: "CAR",
        vehicleModel: "HONDA",
      },
      {
        date: "2023-08-19",
        time: "03:00:00",
        latitude: 15.040579,
        longitude: 120.699837,
        barangay: "San Jose",
        vehicleType: "TRUCK",
        vehicleModel: "HINO",
      },
    ];

    const allData = [...data, ...newData];

    // Create heatmap circles
    const circles = allData.map((item) =>
      L.circle([item.latitude, item.longitude], {
        radius: 25,
        stroke: false,
      })
    );

    const heatmapData = allData.map((item) => [item.latitude, item.longitude]);

    const heat = L.heatLayer(heatmapData, {
      radius: 25,
      gradient: {
        0.1: "blue",
        0.2: "cyan",
        0.3: "lime",
        0.4: "yellow",
        0.5: "red",
      },
    }).addTo(leafletMap);

    // Show or hide markers based on showMarkers state
    // if (showMarkers) {
    //   markers.forEach((marker) => marker.addTo(leafletMap));
    // }

    // Add circles to the map
    circles.forEach((circle) => circle.addTo(leafletMap));

    leafletMap.addControl(new L.Control.Fullscreen());

    setMap(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, []);

  // Function to toggle marker visibility
  // const toggleMarkers = () => {
  //   setShowMarkers(!showMarkers);
  //   markersRef.current.forEach((marker) => {
  //     if (showMarkers) {
  //       map.removeLayer(marker);
  //     } else {
  //       marker.addTo(map);
  //     }
  //   });
  // };

  return (
    <div className="main-container">
      <div className="map-container">
        <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
      </div>
    </div>
  );
};

export default MainMapPage;
