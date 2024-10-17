import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface JournalEntry {
  date: string;
  title: string;
  content: string;
  goal: string;
}

const Dashboard: React.FC = () => {
  const [entriesThisWeek, setEntriesThisWeek] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [streak, setStreak] = useState(0);
  const [weeklyEntries, setWeeklyEntries] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const calculateEntriesThisWeek = (data: JournalEntry[]) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentEntries = data.filter(
      (entry) => new Date(entry.date) >= oneWeekAgo
    );
    setEntriesThisWeek(recentEntries.length);
  };

  const calculateStreak = React.useCallback((data: JournalEntry[]) => {
    let currentStreak = 0;
    let maxStreak = 0;
    let lastDate: Date | null = null;

    data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    data.forEach((entry) => {
      const entryDate = new Date(entry.date);
      if (lastDate === null || isConsecutiveDay(lastDate, entryDate)) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
      lastDate = entryDate;
    });

    setStreak(maxStreak);
  }, []);

  const isConsecutiveDay = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  };

  const groupEntriesByDayOfWeek = (data: JournalEntry[]) => {
    const daysOfWeek = [0, 0, 0, 0, 0, 0, 0];
    data.forEach((entry) => {
      const dayIndex = new Date(entry.date).getDay();
      daysOfWeek[dayIndex]++;
    });
    setWeeklyEntries(daysOfWeek);
  };

  useEffect(() => {
    const savedData = localStorage.getItem("journalEntries");
    if (savedData) {
      const parsedData: JournalEntry[] = JSON.parse(savedData);
      setTotalEntries(parsedData.length);
      calculateEntriesThisWeek(parsedData);
      calculateStreak(parsedData);
      groupEntriesByDayOfWeek(parsedData);
    }
  }, [calculateStreak]);

  const chartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Entries This Week",
        data: weeklyEntries,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Journal Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Entries This Week</h3>
          <p className="text-3xl font-bold">{entriesThisWeek}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Entries</h3>
          <p className="text-3xl font-bold">{totalEntries}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Current Streak</h3>
          <p className="text-3xl font-bold">{streak} days</p>
        </div>
      </div>
      <div className="bg-slate-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Weekly Entry Trend</h3>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;
