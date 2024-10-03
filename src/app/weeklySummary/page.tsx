"use client"; // This ensures client-side rendering

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar/NavBar";

const WeeklySummaryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [summaryData, setSummaryData] = useState<{ content?: string }>({});

  useEffect(() => {
    // Get the 'content' from the URL's search parameters
    const content = searchParams.get("content");
    if (content) {
      setSummaryData({ content });
    }
  }, [searchParams]);

  const handleToggleModal = () => {
    // Your modal toggle logic here
  };

  return (
    <div>
      <NavBar onToggleModal={handleToggleModal} />
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Weekly Summary</h1>
        <p className="text-slate-600">
          <strong>Content:</strong> {summaryData.content}
        </p>
      </div>
    </div>
  );
};

export default WeeklySummaryPage;
