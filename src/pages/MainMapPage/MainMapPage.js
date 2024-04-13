import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerPin from "../../assets/icons/pin.png";
import "./MainMapPage.css";

const MainMapPage = () => {
  const [map, setMap] = useState(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const leafletMap = L.map(mapContainerRef.current).setView(
      [15.049528, 120.69425],
      13
    );
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png").addTo(
      leafletMap
    );

    const customIcon = L.icon({
      iconUrl: markerPin,
      iconSize: [30, 45], // Corrected iconSize
      iconAnchor: [15, 45],
      popupAnchor: [0, -45],
    });

    const marker1 = L.marker([15.0388056, 120.6806944], {
      icon: customIcon,
    }).addTo(leafletMap);

    const marker2 = L.marker([15.041083, 120.683222], {
      icon: customIcon,
    }).addTo(leafletMap);

    setMap(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, []);

  return (
    <div className="main-container">
      <div className="map-container">
        <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
      </div>
    </div>
  );
};

export default MainMapPage;
