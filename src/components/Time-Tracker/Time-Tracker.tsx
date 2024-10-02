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
    <div>
    
      <div className="p-4 bg-slate-500 rounded-2xl shadow-lg">
        <h2 className="text-[12px] text-slate-400">Current Time</h2>
        <p>{time.toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default TimeTracker;
