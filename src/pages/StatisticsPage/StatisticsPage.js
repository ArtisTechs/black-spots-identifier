import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { BarController, CategoryScale, LinearScale, Title } from "chart.js";
import "./StatisticsPage.css";

const StatisticsPage = () => {
  const chartContainerRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    // Register the necessary controllers and scales
    Chart.register(BarController, CategoryScale, LinearScale, Title);

    const ctx = chartContainerRef.current.getContext("2d");

    // Sample data for demonstration
    const labels = Array.from({ length: 30 }, (_, i) => `Barangay ${i + 1}`);

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Accidents",
          backgroundColor: "#d00000",
          data: Array.from(
            { length: 100 },
            () => Math.floor(Math.random() * 100) + 1
          ),
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
      data: data,
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
          <h3>Number of accidents per Barangays over the past 5 years.</h3>
        </div>
        <canvas ref={chartContainerRef} style={{ height: "100vh" }}></canvas>
      </div>
    </div>
  );
};

export default StatisticsPage;
