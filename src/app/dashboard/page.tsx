"use client";

import React, { useState } from "react";
// import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar/NavBar";
import Dashboard from "@/components/Dashboard/Dashboard";
import Modal from "@/components/Modal/Modal";
// import { Bar, Line, Pie } from "react-chartjs-2";
import Link from "next/link";
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
      <div className="pt-[6rem] w-[18rem] ml-[1.8rem]">
        <Link href="/content">
        <div className="rounded-2xl border  bg-transparent w-[12rem] h-[3rem] p-2 shadow hover:translate-x-9 cursor-pointer">
          <h1 className="text-orange-800 w-[12rem] font-bold ml-[.rem]">
            Back to Daily Journal
          </h1>
        </div>
        </Link>
      </div>
      <div className="container mx-auto px-4 py-8 z-[-50] pt-[4rem]">
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
