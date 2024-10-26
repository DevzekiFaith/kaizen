"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import NavBar from "@/components/NavBar/NavBar";
import Image from "next/image";
import ConfirmationModal from "@/components/ConfirmatioModal/ConfirmationModal";
import jsPDF from "jspdf";
import Cover26 from "../../../Public/images/cover26.jpg";

const DynamicModal = dynamic(() => import("@/components/Modal/Modal"), {
  ssr: false,
});

interface JournalEntry {
  date: string;
  title: string;
  content: string;
  goal: string;
  id: string;
}

const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  // Initialize state with a function to avoid running on server
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Only run on client-side
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue((currentStoredValue) => {
        const valueToStore =
          value instanceof Function ? value(currentStoredValue) : value;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  return [storedValue, setValue];
};

const generateUniqueId = () => {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 15);
  const uuid = crypto.randomUUID();
  return `${timestamp}-${random}-${uuid}`;
};

const isEntryDuplicate = (entry: JournalEntry, entries: JournalEntry[]): boolean => {
  const existingEntry = entries.find(
    (existing) =>
      existing.date === entry.date &&
      existing.title === entry.title &&
      existing.goal === entry.goal
  );
  return !!existingEntry;
};

const URLParamsHandler: React.FC<{
  onNewEntry: (entry: JournalEntry) => void;
  existingEntries: JournalEntry[];
}> = ({ onNewEntry, existingEntries }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const date = searchParams.get("date");
    const goal = searchParams.get("goal");
    const title = searchParams.get("title");
    const content = searchParams.get("content");

    if (date && goal && title && content) {
      const newEntry = {
        date,
        goal,
        title,
        content,
        id: generateUniqueId(),
      };

      if (!isEntryDuplicate(newEntry, existingEntries)) {
        onNewEntry(newEntry);
      }
      
      // Clear the URL parameters after processing
      router.replace(pathname);
    }
  }, [searchParams, pathname, router, onNewEntry, existingEntries]);

  return null;
};

const JournalEntries: React.FC<{
  entries: JournalEntry[];
  onDeleteEntry: (id: string) => void;
  onDownloadPDF: (entry: JournalEntry) => void;
}> = ({ entries, onDeleteEntry, onDownloadPDF }) => {
  const sortedEntries = useMemo(
    () =>
      [...entries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [entries]
  );

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No journal entries yet. Start writing your first entry!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sortedEntries.map((entry) => (
        <div
          key={entry.id}
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg
                   hover:shadow-xl transition-all duration-300 border border-gray-200 border-opacity-20
                   transform hover:-translate-y-2 hover:scale-105"
        >
          <h2 className="text-2xl font-bold text-white mb-2">{entry.title}</h2>
          <p className="text-gray-300 text-sm mb-3">{entry.date}</p>
          <p className="text-gray-100 mt-2 mb-4 line-clamp-3">{entry.content}</p>
          <p className="text-gray-400 mt-2 mb-4 text-sm">Goal: {entry.goal}</p>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => onDeleteEntry(entry.id)}
              className="bg-transparent border text-white py-2 px-4 rounded-full hover:bg-red-600
                       transition-all duration-300 text-sm transform hover:scale-110"
            >
              Delete
            </button>
            <button
              onClick={() => onDownloadPDF(entry)}
              className="bg-transparent border text-white py-2 px-4 rounded-full hover:bg-blue-600
                       transition-all duration-300 text-sm transform hover:scale-110"
            >
              Download PDF
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const DailyJournal: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [journalData, setJournalData] = useLocalStorage<JournalEntry[]>(
    "dailyJournalData",
    []
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDeleteAllEntries = useCallback(
    () => setIsDeleteModalOpen(true),
    []
  );

  const deleteAllEntries = useCallback(() => {
    setJournalData([]);
    setIsDeleteModalOpen(false);
  }, [setJournalData]);

  const deleteEntry = useCallback(
    (id: string) => {
      setJournalData((prevData) => prevData.filter((entry) => entry.id !== id));
    },
    [setJournalData]
  );

  const handleShareWeeklyJournal = useCallback(
    () => setIsShareModalOpen(true),
    []
  );

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

  const handleToggleModal = useCallback(
    () => setModalOpen((prev) => !prev),
    []
  );

  const handleCloseModal = useCallback(() => setModalOpen(false), []);

  const addNewEntry = useCallback(
    (entry: JournalEntry) => {
      setJournalData((prev) => {
        if (isEntryDuplicate(entry, prev)) {
          return prev;
        }
        return [...prev, entry];
      });
    },
    [setJournalData]
  );

  // Show loading state before client-side hydration
  if (!isClient) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading journal...</div>
      </div>
    );
  }

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
            src={Cover26}
            width={500}
            height={700}
            placeholder="blur"
            alt="Cover-Cover"
          />
        </div>
        <div className="w-full xl:w-2/3">
          <h1 className="text-4xl font-bold mb-8 text-white text-center xl:text-left">
            Daily Journal
          </h1>
          <URLParamsHandler onNewEntry={addNewEntry} existingEntries={journalData} />
          <JournalEntries
            entries={journalData}
            onDeleteEntry={deleteEntry}
            onDownloadPDF={downloadPDF}
          />
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