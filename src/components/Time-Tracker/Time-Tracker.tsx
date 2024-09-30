import { useState, useEffect } from "react";

const TimeTracker = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <div className="p-4 bg-slate-500 rounded-2xl shadow-lg">
      <h2 className="text-[12px]">Current Time</h2>
      <p>{time.toLocaleTimeString()}</p>
    </div>
  );
};

export default TimeTracker;
