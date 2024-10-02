"use client"
// Import useRouter to access query parameters

import React from "react";
import { useRouter } from 'next/navigation'; // Import useRouter to access query parameters

// Define a type for the expected query parameters
type Query = {
    title?: string; // Changed to lowercase 'title' for consistency
    goal?: string;
};

const DailyJournalPage = () => {
  const router = useRouter(); // Ensure this is correctly set

  // Check if router.query is defined before destructuring
  const { title = '', goal = '' } = (router.query as Query) || {}; // Provide default values

  const Time = new Date().toLocaleTimeString(); // Define Time

  const activity = "Your activity here"; // Define the activity variable

  const journalDate = new Date(); // Define your date variable here

  return (
    <div>
      <h1 className="text-white">This is the Daily Journal Page</h1>
      {title ? ( // Use 'title' instead of 'Title'
        <div>
          <h2>{title}</h2>
          <p>Date: {journalDate.toLocaleDateString()}</p> 
          <p>Time: {Time}</p>
          <p>Goal: {goal}</p>
          <p>Activity: {activity}</p> 
        </div>
      ) : (
        <p>No journal data available.</p>
      )}
    </div>
  );
};

export default DailyJournalPage;


