"use client";

import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar/NavBar";
import Modal from "@/components/Modal/Modal";
import Image from "next/image";
import Cover23 from "../../../Public/images/cover23.jpg"

interface JournalEntry {
  date: string;
  title: string;
  content: string;
  goal: string;
}

const WeeklySummaryPage: React.FC = () => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [weeklyGoalProgress, setWeeklyGoalProgress] = useState<number>(0);

  useEffect(() => {
    const storedEntries: JournalEntry[] = JSON.parse(
      localStorage.getItem("journalEntries") || "[]"
    );

    const startOfWeek: Date = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const weekEntries: JournalEntry[] = storedEntries.filter(
      (entry: JournalEntry) => {
        const entryDate: Date = new Date(entry.date);
        return entryDate >= startOfWeek && entryDate < new Date();
      }
    );

    setJournalEntries(weekEntries);

    const totalEntries: number = weekEntries.length;
    const entriesWithGoals: number = weekEntries.filter(
      (entry: JournalEntry) => entry.goal.trim() !== ""
    ).length;
    setWeeklyGoalProgress(
      Math.round((entriesWithGoals / totalEntries) * 100) || 0
    );
  }, []);

  const handleToggleModal = (): void => {
    setIsModalOpen((prev: boolean) => !prev);
  };

  const toggleTheme = (): void => {
    // Implement theme toggle logic here
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
            src={Cover23}
            width={500}
            height={500}
            alt="Weekly Summary Cover"
          />
        </div>
        <div className="container mx-auto p-8 pt-[5rem]">
          <h1 className="text-2xl font-bold mb-6 text-white">Weekly Summary</h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              Weekly Goal Progress
            </h2>
            <div className="bg-gray-200 h-4 rounded-full">
              <div
                className={`bg-orange-600 h-full rounded-full w-[${weeklyGoalProgress}%]`}
              ></div>
            </div>
            <p className="text-white mt-2">
              {weeklyGoalProgress}% of entries have goals
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {journalEntries.length > 0 ? (
              journalEntries.map((entry: JournalEntry, index: number) => (
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
                    <strong>Goal:</strong> {entry.goal || "No goal set"}
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
