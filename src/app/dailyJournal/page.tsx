"use client"; // Ensures the component is rendered on the client-side

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar/NavBar";
import Modal from '@/components/Modal/Modal'; // Import the Modal component

const DailyJournal: React.FC = () => {
  const searchParams = useSearchParams();
  const [journalData, setJournalData] = useState<{
    date?: string;
    title?: string;
    content?: string;
    goal?: string;
  }>({});
  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    // Load data from local storage
    const savedData = localStorage.getItem('dailyJournalData');
    if (savedData) {
      setJournalData(JSON.parse(savedData));
    }

    // Get parameters from the search URL
    const date = searchParams.get("date");
    const title = searchParams.get("title");
    const content = searchParams.get("content");
    const goal = searchParams.get("goal");

    // Ensure the parameters exist before setting the state
    if (date || title || content || goal) {
      const newJournalData = { 
        date: date ?? undefined, 
        title: title ?? undefined, 
        content: content ?? undefined, 
        goal: goal ?? undefined 
      };
      setJournalData(newJournalData);
      localStorage.setItem('dailyJournalData', JSON.stringify(newJournalData)); // Save to local storage
    }
  }, [searchParams]);

  const handleToggleModal = () => {
    setModalOpen(!isModalOpen); // Toggle modal visibility
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleToggleTheme = () => {
    // Add your theme toggle logic here
  };

  const handleSaveData = (data) => {
    setJournalData(data);
    localStorage.setItem('dailyJournalData', JSON.stringify(data)); // Save updated data to local storage
  };

  return (
    <div className="w-[24rem]">
      <NavBar onToggleModal={handleToggleModal} />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} toggleTheme={handleToggleTheme} />
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">Daily Journal</h1>
        <p className="text-slate-600">
          <strong>Date:</strong> {journalData.date}
        </p>
        <p className="text-slate-600">
          <strong>Title:</strong> {journalData.title}
        </p>
        <p className="text-slate-600">
          <strong>Content:</strong> {journalData.content}
        </p>
        <p className="text-slate-600">
          <strong>Goal:</strong> {journalData.goal}
        </p>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleToggleModal}>
        <h2>Journal Entry</h2>
        {/* Add your modal content here */}
        <p>This is where you can add more details or a form.</p>
      </Modal>
    </div>
  );
};

export default DailyJournal;
