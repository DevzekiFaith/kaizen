// Ensures the component is rendered on the client-side
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar/NavBar";
import Modal from "@/components/Modal/Modal";
import Image from "next/image";

// Separate JournalContent component to handle journal logic
const JournalContent: React.FC = () => {
  const searchParams = useSearchParams();
  const [journalData, setJournalData] = useState<
    Array<{ date?: string; title?: string; content?: string; goal?: string }>
  >([]);

  useEffect(() => {
    const savedData = localStorage.getItem("dailyJournalData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setJournalData(Array.isArray(parsedData) ? parsedData : []);
    }

    const date = searchParams.get("date");
    const title = searchParams.get("title");
    const content = searchParams.get("content");
    const goal = searchParams.get("goal");

    if (date || title || content || goal) {
      const newJournalData = {
        date: date ?? undefined,
        title: title ?? undefined,
        content: content ?? undefined,
        goal: goal ?? undefined,
      };
      handleSaveData(newJournalData);
    }
  }, [searchParams]);

  const handleSaveData = (data: {
    date?: string;
    title?: string;
    content?: string;
    goal?: string;
  }) => {
    const existingData = JSON.parse(
      localStorage.getItem("dailyJournalData") || "[]"
    );
    const updatedData = Array.isArray(existingData) ? existingData : [];

    const isDuplicate = updatedData.some(
      (entry) =>
        entry.date === data.date &&
        entry.title === data.title &&
        entry.content === data.content
    );

    if (!isDuplicate) {
      updatedData.push(data);
      setJournalData(updatedData);
      localStorage.setItem("dailyJournalData", JSON.stringify(updatedData));
    }
  };

  const handleDeleteData = (index: number) => {
    const updatedData = journalData.filter((_, i) => i !== index);
    setJournalData(updatedData);
    localStorage.setItem("dailyJournalData", JSON.stringify(updatedData));
  };

  const handleDeleteAllEntries = () => {
    setJournalData([]);
    localStorage.removeItem("dailyJournalData");
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {journalData.map((entry, index) => (
        <div
          key={index}
          className="bg-slate-950 shadow-2xl p-4 rounded transform transition-transform duration-300 hover:scale-105"
        >
          <p className="text-slate-700 text-[13px]">
            <strong>Date:</strong> {entry.date}
          </p>
          <p className="text-slate-700 text-[13px]">
            <strong>Title:</strong> {entry.title}
          </p>
          <p className="text-slate-700 text-[13px]">
            <strong>Content:</strong> {entry.content}
          </p>
          <p className="text-slate-700 text-[13px]">
            <strong>Goal:</strong> {entry.goal}
          </p>
          <button
            onClick={() => handleDeleteData(index)}
            className="mt-2 bg-orange-500 text-white text-[12px] py-1 px-2 rounded-3xl shadow-xl shadow-slate-800"
          >
            Delete Entry
          </button>
        </div>
      ))}
      <button
        onClick={handleDeleteAllEntries}
        className="mt-4 bg-[#1a0804] text-slate-500 py-2 px-4 rounded"
      >
        Delete All Entries
      </button>
    </div>
  );
};

// Main Component
const DailyJournal: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleToggleModal = () => setModalOpen((prev) => !prev);

  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="w-full">
      <NavBar onToggleModal={handleToggleModal} />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        toggleTheme={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <div className="flex xl:flex-row flex-col justify-center items-center w-full gap-[2rem] p-[2rem]">
        <div className="w-full mt-[4rem] xl:mt-[-6rem]">
          <Image
            className="w-[34rem] h-screen transition translate-x-10 duration-10 ease-out "
            src="/images/cover26.jpg"
            width={300}
            height={300}
            priority
            alt="dark-cover"
          />
        </div>
        <div className="mx-auto pt-[6rem] p-[1rem] w-full">
          <h1 className="text-2xl font-bold mb-6 text-white">Daily Journal</h1>
          <Suspense
            fallback={<p className="text-slate-300">Loading journal data...</p>}
          >
            <JournalContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default DailyJournal;
