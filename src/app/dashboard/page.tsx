"use client";

import React, { useState } from "react";
// import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar/NavBar";
import Dashboard from "@/components/Dashboard/Dashboard";
import Modal from "@/components/Modal/Modal";
// import { Bar, Line, Pie } from "react-chartjs-2";
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
  Legend,
} from "chart.js";

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

// interface Goal {
//   id: string;
//   title: string;
//   description: string;
//   targetDate: string;
// }

const DashboardPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleTheme = () => {
    // Implement theme toggling logic here
    console.log("Theme toggled");
  };

  return (
    <div className="w-full">
      <NavBar onToggleModal={toggleModal} />
      <div className="container mx-auto px-4 py-8 z-[-50] pt-[6rem]">
        <div>
          <h1 className="text-slate-500 uppercase font-bold p-4">
            Daily Entries for the Week
          </h1>
        </div>
        <Dashboard />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        toggleTheme={toggleTheme}
      />
    </div>
  );
};
export default DashboardPage;
