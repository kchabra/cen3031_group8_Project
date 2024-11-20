import React from "react";
import { Chart, ArcElement, Tooltip, Legend, PieController } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend, PieController);

const ExpenseChart = ({ expenses = [] }) => {
  // Handle the case where expenses are empty
  if (!expenses || expenses.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>No expenses to show</h2>
        <p>Please add some expenses to visualize.</p>
      </div>
    );
  }

  // Group expenses by category
  const categoryData = {};
  expenses.forEach((expense) => {
    categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
  });

  // Prepare data for the pie chart
  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "80%", margin: "0 auto", textAlign: "center" }}>
      <h2>Expense Distribution by Category</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default ExpenseChart;



