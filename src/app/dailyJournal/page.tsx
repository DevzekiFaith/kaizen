"use client";  // Ensure client-side rendering

import React, { useEffect, useState, useCallback, useMemo } from "react";
import NavBar from "@/components/NavBar/NavBar";
import Modal from "@/components/Modal/Modal";
import Image from "next/image";
import ConfirmationModal from "@/components/ConfirmatioModal/ConfirmationModal";
import jsPDF from "jspdf";

interface JournalEntry {
  date: string;
  title: string;
  content: string;
  goal: string;
}

const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const DailyJournal: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [journalData, setJournalData] = useLocalStorage<JournalEntry[]>(
    "dailyJournalData",
    []
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    const currentSearch = window.location.search;
    if (!searchParams || currentSearch !== searchParams.toString()) {
      setSearchParams(new URLSearchParams(currentSearch));
    }
  }, [searchParams]);

  const addOrUpdateEntry = useCallback(
    (newEntry: JournalEntry) => {
      setJournalData((prevData) => {
        const existingEntryIndex = prevData.findIndex(
          (entry) => entry.date === newEntry.date
        );
        if (existingEntryIndex !== -1) {
          return prevData.map((entry, index) =>
            index === existingEntryIndex ? newEntry : entry
          );
        } else {
          return [...prevData, newEntry];
        }
      });
    },
    [setJournalData]
  );

  useEffect(() => {
    if (searchParams) {
      const date = searchParams.get("date");
      const goal = searchParams.get("goal");
      const title = searchParams.get("title");
      const content = searchParams.get("content");

      if (date && goal && title && content) {
        const newEntry = { date, goal, title, content };
        addOrUpdateEntry(newEntry);
      }
    }
  }, [searchParams, addOrUpdateEntry]);

  const handleDeleteAllEntries = useCallback(() => setIsDeleteModalOpen(true), []);
  const deleteAllEntries = useCallback(() => {
    setJournalData([]);
    setIsDeleteModalOpen(false);
  }, [setJournalData]);

  const deleteEntry = useCallback(
    (date: string) => {
      setJournalData((prevData) => prevData.filter((entry) => entry.date !== date));
    },
    [setJournalData]
  );

  const handleShareWeeklyJournal = useCallback(() => setIsShareModalOpen(true), []);

  const confirmShareWeeklyJournal = useCallback(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyEntries = journalData.filter(
      (entry) =>
        new Date(entry.date) >= oneWeekAgo && new Date(entry.date) <= today
    );

    const subject = encodeURIComponent("Weekly Journal Entries");
    const body = encodeURIComponent(
      weeklyEntries
        .map(
          (entry) =>
            `Date: ${entry.date}\nTitle: ${entry.title}\nContent: ${entry.content}\nGoal: ${entry.goal}\n\n`
        )
        .join("")
    );

    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank");
    setIsShareModalOpen(false);
  }, [journalData]);

  const downloadPDF = useCallback((entry: JournalEntry) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(entry.title, 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${entry.date}`, 20, 30);
    doc.text(`Goal: ${entry.goal}`, 20, 40);
    doc.text(entry.content, 20, 50);
    doc.save(`journal_entry_${entry.date}.pdf`);
  }, []);

  const handleToggleModal = useCallback(() => setModalOpen((prev) => !prev), []);
  const handleCloseModal = useCallback(() => setModalOpen(false), []);

  const sortedJournalData = useMemo(
    () =>
      [...journalData].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [journalData]
  );

  return (
    <div className="w-full">
      <NavBar onToggleModal={handleToggleModal} />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        toggleTheme={() => console.log("Theme toggle not implemented")}
      />
      <div className="flex xl:flex-row flex-col justify-center items-center w-full gap-[2rem] p-[2rem]">
        <div className="w-full mt-[4rem] xl:mt-[-6rem]">
          <Image
            className="w-[34rem] h-screen transition translate-x-10 duration-10 ease-out"
            src="/images/cover26.jpg"
            width={300}
            height={300}
            priority
            alt="dark-cover"
          />
        </div>
        <div className="mx-auto pt-[6rem] p-[1rem] w-full">
          <h1 className="text-2xl font-bold mb-6 text-white">Daily Journal</h1>
          <div className="grid grid-cols-1 gap-4">
            {sortedJournalData.map((entry) => (
              <div key={entry.date} className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-white">{entry.title}</h2>
                <p className="text-gray-300">{entry.date}</p>
                <p className="text-white mt-2">{entry.content}</p>
                <p className="text-gray-400 mt-2">Goal: {entry.goal}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => deleteEntry(entry.date)}
                    className="bg-red-500 text-white py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => downloadPDF(entry)}
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleDeleteAllEntries}
              className="mt-4 bg-[#1a0804] text-slate-500 py-2 px-4 rounded"
            >
              Delete All Entries
            </button>
            <button
              onClick={handleShareWeeklyJournal}
              className="bg-slate-500 border bg-transparent rounded-3xl text-white py-2 px-4"
            >
              Share Weekly Journal
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deleteAllEntries}
        message="Are you sure you want to delete all entries? This action cannot be undone."
      />
      <ConfirmationModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onConfirm={confirmShareWeeklyJournal}
        message="Are you sure you want to share your weekly journal?"
      />
    </div>
  );
};

export default DailyJournal;
