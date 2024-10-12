"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const AnalyticsPage: React.FC = () => {
  const router = useRouter();

  // Sample data - replace with real data from your application
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Goals Completed',
        data: [3, 5, 2, 8, 6, 7, 4],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Goals Analytics',
      },
    },
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');  // Adjust this path if your dashboard is at a different route
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <button 
          onClick={handleBackToDashboard}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Goals Completed Over Time</h2>
          <Bar data={chartData} options={options} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Goal Completion Trend</h2>
          <Line data={chartData} options={options} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Goal Categories Distribution</h2>
          <Pie data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;