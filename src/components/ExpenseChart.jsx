import { useEffect, useRef } from "react";

import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  PieController,
  ArcElement,
  Tooltip,
  Legend
);

function ExpenseChart({ transactions }) {
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

    const expenseTransactions = transactions.filter(
      (transaction) => transaction.type === "expense"
    );

    const categories = [
      "Food",
      "Shopping",
      "Travel",
      "Bills",
      "Entertainment",
      "Other",
    ];

    const categoryTotals = categories.map((category) => {
      return expenseTransactions
        .filter((transaction) => transaction.category === category)
        .reduce(
          (total, transaction) => total + Number(transaction.amount),
          0
        );
    });

    chartInstance.current = new Chart(chartRef.current, {
      type: "pie",

      data: {
        labels: categories,

        datasets: [
          {
            label: "Expenses",
            data: categoryTotals,
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
      <h2>📊 Expense by Category</h2>

      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default ExpenseChart;