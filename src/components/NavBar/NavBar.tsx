"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaAlignJustify, FaCog } from "react-icons/fa";
import { usePathname } from "next/navigation";
import ModeToggle from "../../components/ModeToggle/ModeToggle";
import { logout } from "../../../utils/auth";
import NotificationBell from "@/components/NotificationBell/NotificationBell";
import { auth } from "@/firebase/firebaseConfig";
import Image from "next/image";

const navLinks = [
  { name: "home", path: "/" },
  { name: "daily journal", path: "/dailyJournal" },
  { name: "weekly Summary", path: "/weeklySummary" },
  { name: "dashboard", path: "/dashboard" },
  { name: "contact", path: "/contact" },
  { name: "community", path: "/community" }
];

interface NavBarProps {
  onToggleModal: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onToggleModal }) => {
  const currentPath = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    // Try to get saved user data from localStorage
    const savedDisplayName = localStorage.getItem('userDisplayName');
    const savedPhotoURL = localStorage.getItem('userPhotoURL');
    if (savedDisplayName) setDisplayName(savedDisplayName);
    if (savedPhotoURL) setPhotoURL(savedPhotoURL);

    // Set up an auth state listener to update profile info
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(user.displayName);
        setPhotoURL(user.photoURL);
        // Update localStorage
        localStorage.setItem('userDisplayName', user.displayName || '');
        localStorage.setItem('userPhotoURL', user.photoURL || '');
      } else {
        setDisplayName(null);
        setPhotoURL(null);
        // Clear localStorage on logout
        localStorage.removeItem('userDisplayName');
        localStorage.removeItem('userPhotoURL');
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  const isActive = (path: string): boolean => {
    return currentPath === path;
  };

  const handleToggle = () => {
    setIsAnimating(true);
    onToggleModal();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="fixed w-full bg-black mt-[-1rem] z-[100]">
      <div className="flex justify-between items-center p-[2rem]">
        <div>
          <Link href="/">
            <h6 className="text-slate-900 font-bold uppercase">Reflectify</h6>
          </Link>
        </div>
        <div className="xl:block hidden">
          <ul className="flex justify-center items-center gap-2">
            {navLinks.map((pages, index) => (
              <li key={index}>
                <Link
                  href={pages.path}
                  className={
                    isActive(pages.path)
                      ? "bg-orange-500 text-white p-[8px] rounded-2xl text-[12px] border border-white"
                      : "text-slate-500 hover:text-slate-800"
                  }
                >
                  {pages.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center items-center gap-2">
          <Link href="/settings" className="text-slate-500 hover:text-slate-800 xl:block hidden">
            <FaCog className="text-[1.2rem]" />
          </Link>
          <button
            onClick={logout}
            className="mr-[1rem] border-1 bg-orange-500 p-[6px] w-[4rem] rounded-full font-bold text-slate-300 xl:block hidden"
          >
            logout
          </button>

          {/* Desktop Profile Section */}
          <div className="items-center gap-2 hidden xl:flex">
            {displayName && (
              <span className="text-slate-300 text-sm">{displayName}</span>
            )}
            <div className="rounded-full w-[2.5rem] h-[2.5rem] bg-gray-400 overflow-hidden">
              {photoURL ? (
                <Image 
                  src={photoURL} 
                  width={40} 
                  height={40} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
          </div>

          {/* Mobile Profile Section */}
          <div className="flex items-center gap-2 xl:hidden">
            {displayName && (
              <span className="text-slate-300 text-sm truncate max-w-[100px]">{displayName}</span>
            )}
            <div className="rounded-full w-[2rem] h-[2rem] bg-gray-400 overflow-hidden">
              {photoURL ? (
                <Image 
                  src={photoURL} 
                  width={32} 
                  height={32} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
          </div>
          
          <div>
            <NotificationBell />
          </div>

          <button
            onClick={handleToggle}
            className={`xl:hidden block transition-transform duration-300 ${
              isAnimating ? "rotate-180" : ""
            }`}
            aria-label="Toggle menu"
          >
            <FaAlignJustify className="text-orange-500 text-[1.5rem]" />
          </button>
          <div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
