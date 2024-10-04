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
    setIsModalOpen((prev) => !prev); // Toggle modal visibility
  };

  const handleToggleTheme = () => {
    // Define your theme toggle logic here
  };

  return (
    <div className="bg-black min-h-screen"> {/* Added background color for better visibility */}
      <NavBar onToggleModal={handleToggleModal} />
      <Modal isOpen={isModalOpen} onClose={handleToggleModal} toggleTheme={handleToggleTheme} />
      <div className="container mx-auto p-8 pt-[5rem]">
        <h1 className="text-2xl font-bold mb-6 text-white">Weekly Summary</h1>
        <p className="text-slate-300 font-bold"> {/* Changed text color for better contrast */}
          <strong>Content:</strong> {summaryData.content || "No content available."} {/* Added fallback text */}
        </p>
      </div>
    </div>
  );
};

export default WeeklySummaryPage;
