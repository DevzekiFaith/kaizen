"use client"; // Ensure client-side rendering

import React, { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from 'next/dynamic';
import NavBar from "@/components/NavBar/NavBar";
import Image from "next/image";
import ConfirmationModal from "@/components/ConfirmatioModal/ConfirmationModal";
import jsPDF from "jspdf";

const DynamicModal = dynamic(() => import("@/components/Modal/Modal"), { ssr: false });

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
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
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
    if (typeof window !== "undefined") {
      const currentSearch = window.location.search;
      if (!searchParams || currentSearch !== searchParams.toString()) {
        setSearchParams(new URLSearchParams(currentSearch));
      }
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
      setJournalData((prevData) =>
        prevData.filter((entry) => entry.date !== date)
      );
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
    <div className="w-full min-h-screen bg-slate-950">
      <NavBar onToggleModal={handleToggleModal} />
      {isModalOpen && (
        <DynamicModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          toggleTheme={() => console.log("Theme toggle not implemented")}
        />
      )}
      <div className="flex xl:flex-row flex-col justify-center items-start w-full gap-8 p-8">
        <div className="w-full xl:w-1/3 mt-4 xl:mt-0">
          <Image
            className="w-full h-auto object-cover rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105"
            src="/images/cover26.jpg"
            width={500}
            height={700}
            priority
            alt="dark-cover"
          />
        </div>
        <div className="w-full xl:w-2/3">
          <h1 className="text-4xl font-bold mb-8 text-white text-center xl:text-left">
            Daily Journal
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedJournalData.map((entry) => (
              <div
                key={entry.date}
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg 
                         hover:shadow-xl transition-all duration-300 border border-gray-200 border-opacity-20
                         transform hover:-translate-y-2 hover:scale-105"
              >
                <h2 className="text-2xl font-bold text-white mb-2">
                  {entry.title}
                </h2>
                <p className="text-gray-300 text-sm mb-3">{entry.date}</p>
                <p className="text-gray-100 mt-2 mb-4 line-clamp-3">
                  {entry.content}
                </p>
                <p className="text-gray-400 mt-2 mb-4 text-sm">
                  Goal: {entry.goal}
                </p>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => deleteEntry(entry.date)}
                    className="bg-transparent border text-white py-2 px-4 rounded-full hover:bg-red-600 
                             transition-all duration-300 text-sm transform hover:scale-110"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => downloadPDF(entry)}
                    className="bg-transparent border text-white py-2 px-4 rounded-full hover:bg-blue-600 
                             transition-all duration-300 text-sm transform hover:scale-110"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={handleDeleteAllEntries}
              className="bg-transparent border text-white py-2 px-6 rounded-full hover:bg-red-600 
                       transition-all duration-300 transform hover:scale-105"
            >
              Delete All Entries
            </button>
            <button
              onClick={handleShareWeeklyJournal}
              className="bg-transparent border text-white py-2 px-6 rounded-full hover:bg-green-600 
                       transition-all duration-300 transform hover:scale-105"
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