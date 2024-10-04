"use client"; // Ensures the component is rendered on the client-side

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar/NavBar";
import Modal from "@/components/Modal/Modal"; // Import the Modal component

const DailyJournal: React.FC = () => {
  const searchParams = useSearchParams();
  const [journalData, setJournalData] = useState<Array<{ date?: string; title?: string; content?: string; goal?: string }>>([]); // Change to an array to hold multiple entries
  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    // Load data from local storage
    const savedData = localStorage.getItem("dailyJournalData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Ensure parsedData is an array
      setJournalData(Array.isArray(parsedData) ? parsedData : []);
    }

    // Check for weekly notification
    const lastNotificationDate = localStorage.getItem("lastNotificationDate");
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds

    if (!lastNotificationDate || now.getTime() - new Date(lastNotificationDate).getTime() > oneWeek) {
      // Request permission for notifications
      if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Weekly Journal Summary", {
              body: `You have ${journalData.length} entries in your Daily Journal this week! Check your reflection and gratitude on your daily progress.`,
            });
            localStorage.setItem("lastNotificationDate", now.toISOString()); // Update last notification date
          }
        });
      }
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
        goal: goal ?? undefined,
      };
      handleSaveData(newJournalData); // Save new data using the updated function
    }
  }, [searchParams]);

  const handleToggleModal = () => {
    setModalOpen((prev) => !prev); // Toggle modal visibility
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleToggleTheme = () => {
    // Add your theme toggle logic here
  };

  const handleSaveData = (data: { date?: string; title?: string; content?: string; goal?: string }) => {
    const existingData = JSON.parse(localStorage.getItem("dailyJournalData") || "[]"); // Retrieve existing data
    // Ensure existingData is an array
    const updatedData = Array.isArray(existingData) ? existingData : [];

    // Check for duplicates
    const isDuplicate = updatedData.some(
      (entry) => entry.date === data.date && entry.title === data.title && entry.content === data.content
    );

    if (!isDuplicate) {
      // Only add if not a duplicate
      updatedData.push(data); // Add new data to the existing array
      setJournalData(updatedData); // Update state with the new array
      localStorage.setItem("dailyJournalData", JSON.stringify(updatedData)); // Save updated data to local storage
    }
  };

  const handleDeleteData = (index: number) => {
    const updatedData = journalData.filter((_, i) => i !== index); // Remove the entry at the specified index
    setJournalData(updatedData); // Update state with the new array
    localStorage.setItem("dailyJournalData", JSON.stringify(updatedData)); // Save updated data to local storage
  };

  const handleDeleteAllEntries = () => {
    setJournalData([]); // Clear the journal data
    localStorage.removeItem("dailyJournalData"); // Remove data from local storage
  };

  return (
    <div className="w-[24rem]">
      <NavBar onToggleModal={handleToggleModal} />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} toggleTheme={handleToggleTheme}>
        <h2>Journal Entry</h2>
        {/* Add your modal content here */}
        <p>This is where you can add more details or a form.</p>
      </Modal>
      <div className="mx-auto pt-[6rem] p-[1rem]">
        <h1 className="text-2xl font-bold mb-6 text-white">Daily Journal</h1>
        <div className="mb-[18px]">
          <h6 className="text-slate-400 text-[12px]">
            Daily Journaling empowers your mind for continuation
          </h6>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {journalData.map((entry, index) => (
            <div key={index} className="bg-slate-900 shadow-2xl p-4 rounded transform transition-transform duration-300 hover:scale-105">
              <p className="text-slate-400 text-[13px]">
                <strong>Date:</strong> {entry.date}
              </p>
              <p className="text-slate-400 text-[16px]">
                <strong>Title:</strong> {entry.title}
              </p>
              <p className="text-slate-400 text-[13px]">
                <strong>Content:</strong> {entry.content}
              </p>
              <p className="text-slate-400 text-[13px]">
                <strong>Goal:</strong> {entry.goal}
              </p>
              <button
                onClick={() => handleDeleteData(index)} // Call delete function with the current index
                className="mt-2 bg-orange-500 text-white text-[12px] py-1 px-2 rounded-3xl shadow-xl shadow-slate-800"
              >
                Delete Entry
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleDeleteAllEntries}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
        >
          Delete All Entries
        </button>
      </div>
    </div>
  );
};

export default DailyJournal;