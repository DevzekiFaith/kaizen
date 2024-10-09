import React, { useEffect, useState } from 'react';

const NotificationBell: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const checkAndNotify = () => {
      const lastNotification = localStorage.getItem('lastNotification');
      const now = new Date();
      if (!lastNotification || new Date(lastNotification).getDate() !== now.getDate()) {
        setShowNotification(true);
        playNotificationSound();
        if (Notification.permission === 'granted') {
          new Notification('Daily Journal Reminder', {
            body: 'Time to write in your journal!',
            icon: '/path/to/your/icon.png' // Replace with your icon path
          });
        }
        localStorage.setItem('lastNotification', now.toISOString());
      }
    };

    checkAndNotify();
    const interval = setInterval(checkAndNotify, 86400000); // Check every 24 hours

    return () => clearInterval(interval);
  }, []);

  const playNotificationSound = () => {
    const audio = new Audio('/path/to/your/notification-sound.mp3'); // Replace with your sound file path
    audio.play();
  };

  return (
    <div className="relative">
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
  );
};

export default NotificationBell;
