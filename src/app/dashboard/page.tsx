"use client";

import React, { useState } from "react";
import NavBar from "@/components/NavBar/NavBar";
import Dashboard from "@/components/Dashboard/Dashboard";
import Modal from "@/components/Modal/Modal";
// import PricingModal from "@/components/PricingModal/PricingModal";
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
import { Footer } from "@/components/Footer/Footer";
import BuyCoins from "@/components/BuyCoins/BuyCoins";
// import PaymentButton from "@/components/PaymentButton/PaymentButton";

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

const DashboardPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // const togglePricingModal = () => {
  //   setIsPricingModalOpen(!isPricingModalOpen);
  // };

  const toggleTheme = () => {
    console.log("Theme toggled");
  };

  return (
    <div className="w-full">
      <NavBar onToggleModal={toggleModal} />
      <div className="pt-[6rem] w-full px-[1.8rem] flex justify-between items-center">
        <Link href="/content">
          <div className="rounded-2xl border bg-transparent w-[12rem] h-[3rem] p-2 shadow hover:translate-x-9 cursor-pointer">
            <h1 className="text-orange-800 w-[12rem] font-bold ml-[.rem]">
              Back to Daily Journal
            </h1>
          </div>
        </Link>

        {/* <PaymentButton email="" amount={0} onSuccess={() => {}} onClose={() => {}}/> */}
        {/* <button
          // onClick={togglePricingModal}
          className="rounded-2xl border border-orange-600 bg-transparent px-6 h-[3rem] shadow hover:bg-orange-600 hover:text-white transition-colors duration-300 text-orange-600 font-medium"
        >
          Upgrade to Pro
        </button> */}

        <div className="">
          <BuyCoins/>
        </div>
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
      {/* <PricingModal isOpen={isPricingModalOpen} onClose={togglePricingModal} /> */}

      <div>
        <Footer />
      </div>
    </div>
  );
};
export default DashboardPage;
