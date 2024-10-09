"use client";

import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar/NavBar";
import Modal from "@/components/Modal/Modal";
import Image from "next/image";

interface JournalEntry {
  date: string;
  title: string;
  content: string;
  goal: string;
}

const WeeklySummaryPage: React.FC = () => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const storedEntries = JSON.parse(
      localStorage.getItem("journalEntries") || "[]"
    );

    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const weekEntries = storedEntries.filter((entry: JournalEntry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfWeek && entryDate < new Date();
    });

    setJournalEntries(weekEntries);
  }, []);

  const handleToggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    // Implement theme toggle logic here
    // setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="bg-black min-h-screen w-full">
      <NavBar onToggleModal={handleToggleModal} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleToggleModal}
        toggleTheme={toggleTheme}
      >
        {/* Modal Content */}
      </Modal>
      <div className="pt-[5rem] flex justify-center items-center w-full xl:flex-row flex-col">
        <div className="p-[1.5rem] w-full">
          <Image
            className="h-screen w-[26rem] object-cover"
            src="/images/cover23.jpg"
            width={500}
            height={500}
            alt="Weekly Summary Cover"
          />
        </div>
        <div className="container mx-auto p-8 pt-[5rem]">
          <h1 className="text-2xl font-bold mb-6 text-white">Weekly Summary</h1>
          <div className="grid grid-cols-1 gap-4">
            {journalEntries.length > 0 ? (
              journalEntries.map((entry, index) => (
                <div key={index} className="bg-white p-4 rounded shadow-md">
                  <p className="text-gray-800 font-bold">
                    <strong>Date:</strong> {entry.date}
                  </p>
                  <p className="text-gray-800">
                    <strong>Title:</strong> {entry.title}
                  </p>
                  <p className="text-gray-700">
                    <strong>Content:</strong> {entry.content}
                  </p>
                  <p className="text-gray-700">
                    <strong>Goal:</strong> {entry.goal}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-white font-bold">
                No entries available for the week.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummaryPage;
