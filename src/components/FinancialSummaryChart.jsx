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

function FinancialSummaryChart({
  income,
  expense,
  balance,
}) {
  const chartRef = useRef(null);
  const chartInstance =
    useRef(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    chartInstance.current =
      new Chart(chartRef.current, {
        type: "bar",

        data: {
          labels: [
            "Income",
            "Expense",
            "Balance",
          ],

          datasets: [
            {
              label:
                "Amount (₹)",

              data: [
                income,
                expense,
                balance,
              ],
            },
          ],
        },

        options: {
          responsive: true,

          plugins: {
            legend: {
              position:
                "bottom",
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
  }, [
    income,
    expense,
    balance,
  ]);

  return (
    <div>
      <h2>
        📊 Financial Summary
      </h2>

      <canvas
        ref={chartRef}
      ></canvas>
    </div>
  );
}

export default FinancialSummaryChart;