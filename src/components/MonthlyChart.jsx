import { useEffect, useRef } from "react";

import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function MonthlyChart({ transactions }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const incomeTotals = Array(12).fill(0);
    const expenseTotals = Array(12).fill(0);

    transactions.forEach((transaction) => {
      if (!transaction.date) {
        return;
      }

      const monthIndex =
        Number(transaction.date.substring(5, 7)) - 1;

      const amount = Number(transaction.amount);

      if (transaction.type === "income") {
        incomeTotals[monthIndex] += amount;
      }

      if (transaction.type === "expense") {
        expenseTotals[monthIndex] += amount;
      }
    });

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",

      data: {
        labels: months,

        datasets: [
          {
            label: "Income",
            data: incomeTotals,
          },
          {
            label: "Expense",
            data: expenseTotals,
          },
        ],
      },

      options: {
        responsive: true,

        plugins: {
          legend: {
            position: "bottom",
          },
        },

        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [transactions]);

  return (
    <div>
      <h2>📊 Monthly Income vs Expense</h2>

      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default MonthlyChart;