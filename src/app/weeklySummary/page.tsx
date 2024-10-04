"use client"; // This ensures client-side rendering

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar/NavBar";
import Modal from "@/components/Modal/Modal"; // Import the Modal component

const WeeklySummaryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [summaryData, setSummaryData] = useState<{ content?: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    // Get the 'content' from the URL's search parameters
    const content = searchParams.get("content");
    if (content) {
      setSummaryData({ content });
    }
  }, [searchParams]);

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  const handleToggleTheme = () => {
    // Define your theme toggle logic here
  };

  return (
    <div>
      <NavBar onToggleModal={handleToggleModal} />
      <Modal isOpen={isModalOpen} onClose={handleToggleModal} toggleTheme={handleToggleTheme} />
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Weekly Summary</h1>
        <p className="text-slate-600 font-bold">
          <strong>Content:</strong> {summaryData.content}
        </p>
      </div>
    </div>
  );
};

export default WeeklySummaryPage;
