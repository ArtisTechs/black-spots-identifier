import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { BarController, CategoryScale, LinearScale, Title } from "chart.js";
import "./PointStatisticsPage.css";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

Chart.register(BarController, CategoryScale, LinearScale, Title);

const PointStatisticsPage = ({ goBack }) => {
  const chartContainerRef = useRef(null);
  const chartContextRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    localStorage.getItem("selectedYearStat") || "All Years"
  );
  const [filteredDataByYear, setFilteredDataByYear] = useState({});

  useEffect(() => {
    const ctx = chartContainerRef.current.getContext("2d");
    chartContextRef.current = ctx;

    const uploadedData = localStorage.getItem("uploadedExcelDataForAccident");
    const data = uploadedData ? JSON.parse(uploadedData) : [];

    const filteredData = {};
    const totalAccidents = {};

    data.forEach((item) => {
      const year = item.year;
      if (!filteredData[year]) {
        filteredData[year] = [];
        totalAccidents[year] = {};
      }
      const pointData = {};
      for (let key in item) {
        if (key.startsWith("Point")) {
          pointData[key] = item[key];
          totalAccidents[year][key] =
            (totalAccidents[year][key] || 0) + item[key];
        }
      }
      filteredData[year].push(pointData);
    });

    filteredData["All Years"] = Object.values(totalAccidents).reduce(
      (acc, curr) => {
        for (let key in curr) {
          acc[key] = (acc[key] || 0) + curr[key];
        }
        return acc;
      },
      {}
    );

    setFilteredDataByYear(filteredData);

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedYear || !filteredDataByYear[selectedYear]) {
      return;
    }
    localStorage.setItem("selectedYearStat", selectedYear);

    const filteredData = filteredDataByYear[selectedYear];
    let chartData;

    if (selectedYear === "All Years") {
      const allYearsData = Object.values(filteredDataByYear).reduce(
        (acc, curr) => {
          for (let key in curr) {
            acc[key] = (acc[key] || 0) + curr[key];
          }
          return acc;
        },
        {}
      );

      const filteredAllYearsData = Object.entries(allYearsData)
        .filter(([point, total]) => total > 0)
        .reduce((obj, [point, total]) => {
          obj[point] = total;
          return obj;
        }, {});

      chartData = {
        labels: Object.keys(filteredAllYearsData),
        datasets: [
          {
            label: "Number of Accidents (All Years)",
            data: Object.values(filteredAllYearsData),
            backgroundColor: "rgba(255, 0, 0, 1)",
            borderColor: "rgba(255, 0, 0, 1)",
            borderWidth: 1,
          },
        ],
      };
    } else {
      chartData = {
        labels: Object.keys(filteredData[0] || {}).filter((key) =>
          key.startsWith("Point")
        ),
        datasets: [
          {
            label: `Number of Accidents (${selectedYear})`,
            data: Object.values(filteredData[0] || {}),
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
  }, [selectedYear, filteredDataByYear]);

  return (
    <div className="main-container-stat">
      <div className="stat-container">
        <div className="header">
          <button onClick={goBack} className="back-button">
            <FontAwesomeIcon className="back-button-icon" icon={faAngleLeft} />
          </button>
          <h3>Number of Accidents Per Point.</h3>
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
    </div>
  );
};

export default PointStatisticsPage;
