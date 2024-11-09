import React, { useEffect, useState } from "react";
// import message from "/messageAlert/";

const NotificationBell: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false); // Track if the component has mounted

  useEffect(() => {
    setIsMounted(true); // Set mounted to true after the component mounts

    const checkAndNotify = () => {
      const lastNotification = localStorage.getItem("lastNotification");
      const now = new Date();
      if (
        !lastNotification ||
        new Date(lastNotification).getDate() !== now.getDate()
      ) {
        setShowNotification(true);
        setNotificationMessage("Time to write in your journal!");
        playNotificationSound(); // Play sound immediately upon notification
        if (Notification.permission === "granted") {
          new Notification("Daily Journal Reminder", {
            body: "Time to write in your journal!",
            icon: "/path/to/your/icon.png", // Replace with your icon path
          });
        }
        localStorage.setItem("lastNotification", now.toISOString());
      }
    };

    checkAndNotify();
    const interval = setInterval(checkAndNotify, 86400000); // Check every 24 hours

    return () => clearInterval(interval);
  }, []);

  const playNotificationSound = () => {
    const audio = new Audio("/messageAlert/livechat-129007.mp3"); // Replace with your sound file path
    audio.play().catch((error) => {
      console.error("Error playing sound:", error); // Log any errors
    });
  };

  const handleBellClick = () => {
    if (showNotification) {
      setShowNotification(false);
      setNotificationMessage("Notification acknowledged.");
    } else {
      setNotificationMessage("No new notifications.");
    }
    setTimeout(() => setNotificationMessage(""), 3000);
  };

  return (
    <div className="relative">
      {isMounted && ( // Only render after the component has mounted
        <div onClick={handleBellClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {showNotification && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </div>
      )}
      {notificationMessage && (
        <div className="absolute top-8 right-0 bg-white text-black p-2 rounded shadow-md">
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
