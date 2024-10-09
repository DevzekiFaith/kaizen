"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IoIosArrowDroprightCircle,
  IoIosArrowDropleftCircle,
} from "react-icons/io";
import { FaUser, FaSearch } from "react-icons/fa";

const images = [
  "/images/cover32.jpg",
  "/images/cover28.jpg",
  "/images/cover31.jpg",
];

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [journalStreak, setJournalStreak] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLoggedIn(Math.random() > 0.5);
    setJournalStreak(Math.floor(Math.random() * 30));
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-800">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        {isLoggedIn ? (
          <Link href="/profile">
            <FaUser className="text-orange-600 w-6 h-6" />
          </Link>
        ) : (
          <Link href="/signIn">
            <button className="bg-orange-600 text-white px-4 py-2 rounded">Login</button>
          </Link>
        )}
      </div>

      <h1 className="text-[16px] font-extrabold text-orange-600 mb-6 absolute top-[10rem] xl:left-[28rem] z-50 uppercase">
        Reflectify!
      </h1>

      <div className="relative mb-8">
        <Image
          src={images[currentImageIndex]}
          alt="Welcome"
          width={600}
          height={400}
          priority
          className="rounded-lg shadow-lg transition-transform duration-500"
        />
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black rounded-full p-2 shadow hover:bg-gray-200 transition"
          aria-label="Previous Image"
          title="Previous Image"
        >
          <IoIosArrowDropleftCircle className="w-[44px] h-[44px]" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black rounded-full p-2 shadow hover:bg-gray-200 transition"
          aria-label="Next image"
          title="Next Image"
        >
          <IoIosArrowDroprightCircle className="w-[44px] h-[44px]" />
        </button>
      </div>

      <div className="mb-8 w-full max-w-md">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries..."
            className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none"
          />
          <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-r-lg" title="Search">
            <FaSearch />
          </button>
        </form>
      </div>

      {isLoggedIn && (
        <div className="mb-8 w-full max-w-md bg-slate-950 p-4 rounded-lg">
          <h3 className="text-orange-600 font-bold mb-2">Journal Streak</h3>
          <div className="bg-gray-200 h-4 rounded-full">
            <div
              className={`bg-orange-600 h-full rounded-full w-[${(journalStreak / 30) * 100}%]`}
            ></div>
          </div>
          <p className="text-slate-600 text-sm mt-2">{journalStreak} days in a row!</p>
        </div>
      )}

      <p className="text-[12px] mb-10 text-center  text-slate-600 w-[400px]">
        Explore your daily reflections and insights. Connect with your thoughts
        and share your journey.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl px-4">
        <Link href="/signIn">
          <div className="bg-slate-950 text-slate-600 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl shadow-slate-800">
            <h2 className="text-xl font-bold mb-2 text-orange-600">
              Daily Journal
            </h2>
            <p>
              Access your daily reflections and insights, track your progress
              over time, and gain deeper clarity on your goals with personalized
              summaries, actionable takeaways, and motivational prompts. Stay
              inspired by reviewing past achievements, and receive tailored
              guidance to keep you on the path of continuous growth
            </p>
          </div>
        </Link>
        <Link href="/signIn">
          <div className="bg-slate-950 text-slate-600 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl shadow-slate-800">
            <h2 className="text-xl font-bold mb-2 text-orange-600">
              Weekly Summary
            </h2>
            <p>
              View and edit your personal information to keep your profile up to
              date, ensuring your preferences, achievements, and milestones are
              accurately reflected. Customize your settings, update your goals,
              and manage your privacy with ease, allowing you to maintain full
              control over your personal data and tailor your experience to your
              needs
            </p>
          </div>
        </Link>
        <Link href="/signIn">
          <div className="bg-slate-950 text-slate-600 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl shadow-slate-800 mb-[2rem]">
            <h2 className="text-xl font-bold mb-2 text-orange-600">Settings</h2>
            <p>
              Customize your experience and preferences to suit your individual
              needs. Personalize your notifications, themes, and layouts, set
              tailored reminders, adjust accessibility options, and control the
              way you interact with the platform. Whether you are focusing on
              productivity, relaxation, or goal tracking, make the app truly
              yours by adjusting features that enhance your journey
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};export default Home;
