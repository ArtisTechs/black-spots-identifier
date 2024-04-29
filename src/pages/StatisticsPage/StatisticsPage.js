import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { BarController, CategoryScale, LinearScale, Title } from "chart.js";
import "./StatisticsPage.css";
import * as geolib from "geolib";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faStreetView } from "@fortawesome/free-solid-svg-icons";
import { faCircleDot } from "@fortawesome/free-regular-svg-icons";
import PointStatisticsPage from "../PointStatisticsPage/PointStatisticsPage";

Chart.register(BarController, CategoryScale, LinearScale, Title);

const StatisticsPage = () => {
  const chartContainerRef = useRef(null);
  const chartContextRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [earliestYear, setEarliestYear] = useState(Number.MAX_SAFE_INTEGER);
  const [latestYear, setLatestYear] = useState(Number.MIN_SAFE_INTEGER);
  const [viewType, setViewType] = useState(
    localStorage.getItem("lastViewType") || null
  );
  const [selectedYear, setSelectedYear] = useState(
    localStorage.getItem("selectedYearStat") || "All Years"
  );
  const [filteredDataByYear, setFilteredDataByYear] = useState({});

  const goBack = () => {
    setViewType(null);
    localStorage.removeItem("selectedYearStat");
    localStorage.removeItem("lastViewType");
  };

  useEffect(() => {
    if (!viewType) {
      return;
    }

    localStorage.setItem("lastViewType", viewType);

    if (viewType === "pointStat") {
      return;
    }

    const ctx = chartContainerRef.current.getContext("2d");
    chartContextRef.current = ctx;

    const uploadedData = localStorage.getItem("uploadedExcelDataForMap");
    const data = uploadedData ? JSON.parse(uploadedData) : [];

    setEarliestYear(
      Math.min(
        ...data.map((item) => new Date(item.dateCommitted).getFullYear())
      )
    );
    setLatestYear(
      Math.max(
        ...data.map((item) => new Date(item.dateCommitted).getFullYear())
      )
    );

    const filteredData = {};
    data.forEach((item) => {
      const date = new Date(item.dateCommitted);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        if (!filteredData[year]) {
          filteredData[year] = [];
        }
        filteredData[year].push(item);
      }
    });

    filteredData["All Years"] = data;

    setFilteredDataByYear(filteredData);

    // Cleanup function to destroy the chart instance on unmount
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [viewType]);

  useEffect(() => {
    if (!selectedYear || !filteredDataByYear[selectedYear]) {
      return;
    }
    localStorage.setItem("selectedYearStat", selectedYear);

    let filteredData = [];
    filteredData = filteredDataByYear[selectedYear];

    let chartData = {};
    if (viewType === "barangay") {
      const combinedDataBarangay = filteredData.reduce((acc, current) => {
        const key = current.barangayStreet;
        const existing = acc.find((item) => item.key === key);

        if (existing) {
          existing.totalAccidents++;
        } else {
          acc.push({
            key,
            totalAccidents: 1,
          });
        }
        return acc;
      }, []);

      chartData = {
        labels: combinedDataBarangay.map((item) => item.key),
        datasets: [
          {
            label: "Number of Accidents",
            data: combinedDataBarangay.map((item) => item.totalAccidents),
            backgroundColor: "rgba(255, 0, 0, 1)",
            borderColor: "rgba(255, 0, 0, 1)",
            borderWidth: 1,
          },
        ],
      };
    } else if (viewType === "per500m") {
      const combinedDataPer500m = filteredData.reduce((acc, current, index) => {
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
          existing.totalData++;
        } else {
          acc.push({
            center: {
              latitude: parseFloat(current.latitude),
              longitude: parseFloat(current.longitude),
            },
            totalData: 1,
            name: `Spot ${index + 1}`,
          });
        }
        return acc;
      }, []);

      const filteredSpots = combinedDataPer500m.filter(
        (spot) => spot.totalData > 5
      );

      filteredSpots.sort((a, b) => {
        if (a.center.latitude !== b.center.latitude) {
          return a.center.latitude - b.center.latitude;
        }
        return a.center.longitude - b.center.longitude;
      });

      filteredSpots.forEach((spot, index) => {
        spot.name = `Spot ${index + 1}`;
      });

      chartData = {
        labels: filteredSpots.map((item) => item.name),
        datasets: [
          {
            label: "Number of Accidents",
            data: filteredSpots.map((item) => item.totalData),
            backgroundColor: "rgba(255, 0, 0, 1)",
            borderColor: "rgba(255, 0, 0, 1)",
            borderWidth: 1,
          },
        ],
      };
    }

    if (chartInstance) {
      chartInstance.destroy();
    }

    const newChartInstance = new Chart(chartContextRef.current, {
      type: "bar",
      data: chartData,
      options: {
        indexAxis: "x",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
        },
      },
    });

    setChartInstance(newChartInstance);

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [viewType, selectedYear, filteredDataByYear]);

  return (
    <div className="main-container-stat">
      {!viewType && (
        <div className="choose-chart-page">
          <h1>Select the type of chart you want to display.</h1>
          <div className="card-container">
            <div className="card" onClick={() => setViewType("barangay")}>
              <FontAwesomeIcon
                className="label-icon-card"
                icon={faStreetView}
              />
              <p>Per Barangay</p>
            </div>
            {/* <div className="card" onClick={() => setViewType("per500m")}>
              <FontAwesomeIcon className="label-icon-card" icon={faCircleDot} />
              <p>Per 500m</p>
            </div> */}
            <div className="card" onClick={() => setViewType("pointStat")}>
              <FontAwesomeIcon className="label-icon-card" icon={faCircleDot} />
              <p>Per Point Statistics</p>
            </div>
          </div>
        </div>
      )}
      {viewType && (
        <>
          {viewType === "pointStat" ? (
            <PointStatisticsPage goBack={goBack} />
          ) : (
            <div className="stat-container">
              <div className="header">
                <button onClick={goBack} className="back-button">
                  <FontAwesomeIcon
                    className="back-button-icon"
                    icon={faAngleLeft}
                  />
                </button>
                <h3>
                  Number of accidents{" "}
                  {viewType === "barangay" ? "per Barangay" : "per 500m"}.
                </h3>
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {Object.keys(filteredDataByYear).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <canvas ref={chartContainerRef} className="chart-canvas"></canvas>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StatisticsPage;
