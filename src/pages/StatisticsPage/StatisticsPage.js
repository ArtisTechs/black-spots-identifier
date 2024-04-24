import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { BarController, CategoryScale, LinearScale, Title } from "chart.js";
import "./StatisticsPage.css";

const StatisticsPage = () => {
  const chartContainerRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [earliestYear, setEarliestYear] = useState(Number.MAX_SAFE_INTEGER);
  const [latestYear, setLatestYear] = useState(Number.MIN_SAFE_INTEGER);

  useEffect(() => {
    // Register the necessary controllers and scales
    Chart.register(BarController, CategoryScale, LinearScale, Title);

    const ctx = chartContainerRef.current.getContext("2d");

    const uploadedData = localStorage.getItem("uploadedExcelData");
    const data = uploadedData ? JSON.parse(uploadedData) : [];

    // Step 1: Combine data based on barangay streets
    const combinedData = data.reduce((acc, current) => {
      const existing = acc.find(
        (item) => item.barangayStreet === current.barangayStreet
      );

      if (existing) {
        existing.totalAccidents++;
      } else {
        acc.push({
          barangayStreet: current.barangayStreet,
          totalAccidents: 1,
        });
      }
      return acc;
    }, []);

    let tempEarliestYear = Number.MAX_SAFE_INTEGER;
    let tempLatestYear = Number.MIN_SAFE_INTEGER;

    data.forEach((item) => {
      const year = new Date(item.dateCommitted).getFullYear();
      if (year < tempEarliestYear) {
        tempEarliestYear = year;
      }
      if (year > tempLatestYear) {
        tempLatestYear = year;
      }
    });

    setEarliestYear(tempEarliestYear);
    setLatestYear(tempLatestYear);

    // Step 2: Prepare data for chart
    const chartData = {
      labels: combinedData.map((item) => item.barangayStreet),
      datasets: [
        {
          label: "Number of Accidents",
          data: combinedData.map((item) => item.totalAccidents),
          backgroundColor: "rgba(255, 0, 0, 1)",
          borderColor: "rgba(255, 0, 0, 1)",
          borderWidth: 1,
        },
      ],
    };

    // Destroy the existing chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Create the new chart instance
    const newChartInstance = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        indexAxis: "y",
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

    // Cleanup function to destroy the chart instance on unmount
    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="main-container">
      <div className="stat-container">
        <div className="header">
          <h3>
            Number of accidents per Barangays from {earliestYear} to{" "}
            {latestYear}.
          </h3>
        </div>
        <canvas ref={chartContainerRef} className="chart-canvas" style={{ height: "100vh" }}></canvas>
      </div>
    </div>
  );
};

export default StatisticsPage;
