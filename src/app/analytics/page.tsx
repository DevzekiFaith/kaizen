"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  PieChart,
  LineChart,
  Bar,
  Pie,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";

interface JournalEntry {
  date: string;
  title: string;
  content: string;
  goal: string;
  weeklySummary: string;
  category: string;
}

const AnalyticsPage = () => {
  const router = useRouter();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [barChartData, setBarChartData] = useState<
    { category: string; count: number }[]
  >([]);
  const [pieChartData, setPieChartData] = useState<
    { name: string; value: number }[]
  >([]);
  const [lineChartData, setLineChartData] = useState<
    { date: string; count: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBackToDailyJournal = () => {
    router.push("/content");
  };

  useEffect(() => {
    try {
      const entries = JSON.parse(
        localStorage.getItem("journalEntries") || "[]"
      ) as JournalEntry[];
      setJournalEntries(entries);

      const barData = processEntriesForBarChart(entries);
      setBarChartData(barData);

      const pieData = processEntriesForPieChart(entries);
      setPieChartData(pieData);

      const lineData = processEntriesForLineChart(entries);
      setLineChartData(lineData);
    } catch (err) {
      setError(
        "Error processing data: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const processEntriesForBarChart = (entries: JournalEntry[]) => {
    const categoryCounts = entries.reduce<Record<string, number>>(
      (acc, entry) => {
        acc[entry.category] = (acc[entry.category] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));
  };

  const processEntriesForPieChart = (entries: JournalEntry[]) => {
    const goalCompletionCounts = entries.reduce(
      (acc, entry) => {
        if (entry.goal === "true") {
          acc.completed++;
        } else {
          acc.notCompleted++;
        }
        return acc;
      },
      { completed: 0, notCompleted: 0 }
    );

    return [
      { name: "Completed", value: goalCompletionCounts.completed },
      { name: "Not Completed", value: goalCompletionCounts.notCompleted },
    ];
  };

  const processEntriesForLineChart = (entries: JournalEntry[]) => {
    const entriesPerDay = entries.reduce<Record<string, number>>(
      (acc, entry) => {
        const date = new Date(entry.date).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(entriesPerDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const calculateAverageContentLength = (entries: JournalEntry[]) => {
    const totalLength = entries.reduce(
      (sum, entry) => sum + entry.content.length,
      0
    );
    return totalLength / entries.length;
  };

  const findMostProductiveDay = (entries: JournalEntry[]) => {
    const entriesPerDay = entries.reduce<Record<string, number>>(
      (acc, entry) => {
        const date = new Date(entry.date).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {}
    );

    const mostProductiveDay = Object.entries(entriesPerDay).reduce<{
      date: string;
      count: number;
    }>((max, [date, count]) => (count > max.count ? { date, count } : max), {
      date: "",
      count: 0,
    });

    return mostProductiveDay.date;
  };

  const averageContentLength = calculateAverageContentLength(journalEntries);
  const mostProductiveDay = findMostProductiveDay(journalEntries);

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-slate-500">Analytics</h1>

      <button
        onClick={handleBackToDailyJournal}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Back to Daily Journal
      </button>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#82ca9d"
            label
          />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      <div>
        <h2>Additional Insights</h2>
        <p>
          Average Content Length: {averageContentLength.toFixed(2)} characters
        </p>
        <p>Most Productive Day: {mostProductiveDay}</p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
