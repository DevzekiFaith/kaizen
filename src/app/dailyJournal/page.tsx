"use client"; // Ensures the component is rendered on the client-side

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const DailyJournal: React.FC = () => {
  const searchParams = useSearchParams();
  const [journalData, setJournalData] = useState<{ date?: string; title?: string; content?: string; goal?: string }>({});

  useEffect(() => {
    // Get parameters from the search URL
    const date = searchParams.get('date');
    const title = searchParams.get('title');
    const content = searchParams.get('content');
    const goal = searchParams.get('goal');

    // Ensure the parameters exist before setting the state
    if (date || title || content || goal) {
      setJournalData({ date, title, content, goal });
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto p-8 border-2 border-slate-700 w-[44rem] rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-white">Daily Journal</h1>
      <p className="text-slate-600"><strong>Date:</strong> {journalData.date}</p>
      <p className="text-slate-600"><strong>Title:</strong> {journalData.title}</p>
      <p className="text-slate-600"><strong>Content:</strong> {journalData.content}</p>
      <p className="text-slate-600"><strong>Goal:</strong> {journalData.goal}</p>
    </div>
  );
};

export default DailyJournal;
