"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar/NavBar';
import Dashboard from '@/components/Dashboard/Dashboard';
import Modal from '@/components/Modal/Modal';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend
);

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
}

const DashboardPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Goal>({ id: '', title: '', description: '', targetDate: '' });
  const [goals, setGoals] = useState<Goal[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load goals from localStorage when the component mounts
    const storedGoals = localStorage.getItem('goals');
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  }, []);

  useEffect(() => {
    // Save goals to localStorage whenever the goals state changes
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleTheme = () => {
    // Implement theme toggling logic here
    console.log('Theme toggled');
  };

  // Sample data for charts (you can update this to use real goal data)
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Goals Set',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for charts
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Goals Overview',
      },
    },
  };

  // Quick action handlers
  const handleNewJournalEntry = () => {
    console.log('New journal entry action');
    // Implement the logic for creating a new journal entry
  };

  const handleNewGoal = () => {
    setIsGoalModalOpen(true);
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goalWithId = { ...newGoal, id: Date.now().toString() };
    setGoals([...goals, goalWithId]);
    setIsGoalModalOpen(false);
    setNewGoal({ id: '', title: '', description: '', targetDate: '' });
  };

  const handleViewAnalytics = () => {
    router.push('/analytics');
  };

  return (
    <div className="w-full">
      <NavBar onToggleModal={toggleModal} />
      <div className="container mx-auto px-4 py-8 z-[-50]">
        <Dashboard />
        
        {/* Quick Action Buttons */}
        <div className="quick-actions mb-8">
          <button onClick={handleNewJournalEntry} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            New Journal Entry
          </button>
          <button onClick={handleNewGoal} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
            Set New Goal
          </button>
          <button onClick={handleViewAnalytics} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            View Analytics
          </button>
        </div>

        {/* Data Visualization */}
        <div className="dashboard-charts grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="chart-container">
            <h3 className="text-lg font-semibold mb-2">Goals Overview</h3>
            <Bar data={chartData} options={options} />
          </div>
          <div className="chart-container">
            <h3 className="text-lg font-semibold mb-2">Goal Progress</h3>
            <Line data={chartData} options={options} />
          </div>
          <div className="chart-container">
            <h3 className="text-lg font-semibold mb-2">Goal Categories</h3>
            <Pie data={chartData} options={options} />
          </div>
        </div>

        {/* Goals List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Goals</h2>
          <ul>
            {goals.map((goal) => (
              <li key={goal.id} className="mb-2">
                <strong>{goal.title}</strong> - Due: {goal.targetDate}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        toggleTheme={toggleTheme}
      />
      
      {/* New Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Set New Goal</h2>
            <form onSubmit={handleGoalSubmit}>
              <label htmlFor="goalTitle" className="block mb-2">Goal Title</label>
              <input
                id="goalTitle"
                type="text"
                placeholder="Enter goal title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                className="w-full p-2 mb-4 border rounded text-slate-500 px-2"
                required
              />
              <label htmlFor="goalDescription" className="block mb-2">Goal Description</label>
              <textarea
                id="goalDescription"
                placeholder="Enter goal description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                className="w-full p-2 mb-4 border rounded text-slate-500 px-2"
                required
              />
              <label htmlFor="goalTargetDate" className="block mb-2">Target Date</label>
              <input
                id="goalTargetDate"
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                className="w-full p-2 mb-4 border rounded text-slate-500 px-2"
                required
              />
              <div className="flex justify-end">
                <button type="button" onClick={() => setIsGoalModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2">
                  Cancel
                </button>
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardPage;