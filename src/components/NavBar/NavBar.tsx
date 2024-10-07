"use client";

import React, { useState } from "react"; // Import useState for animation state
import Link from "next/link";
import { FaAlignJustify } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../Toggle/ModeToggle";
import { logout } from "../../../utils/auth";
import Image from "next/image";

const navLinks = [
  { name: "home", path: "/" },
  { name: "daily journal", path: "/dailyJournal" },
  { name: "weekly Summary", path: "/weeklySummary" },
];

interface NavBarProps {
  onToggleModal: () => void; // Prop to handle modal toggle
}

const NavBar: React.FC<NavBarProps> = ({ onToggleModal }) => {
  const currentPath = usePathname();
  const [isAnimating, setIsAnimating] = useState(false); // State for animation

  const isActive = (path: string): boolean => {
    return currentPath === path;
  };

  const handleToggle = () => {
    setIsAnimating(true); // Set animation state
    onToggleModal(); // Call the toggle modal function
    setTimeout(() => setIsAnimating(false), 300); // Reset animation state after 300ms
  };

  return (
    <div className="fixed w-full bg-black mt-[-2rem] z-[100]">
      <div className="flex justify-between items-center p-[2rem]">
        <div>
          <Link href="/">
            <Image
              className="w-[3.5rem] h-[3.5rem]"
              src="/ref2.logo.png"
              width={150}
              height={150}
              alt="p-work"
            />
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
          <button
            onClick={logout} // Use the logout function directly
            className="mr-[1rem] border-1 bg-orange-500 p-[6px] w-[4rem] rounded-full font-bold text-slate-300 xl:block hidden"
          >
            logout
          </button>

          <div className="rounded-full w-[2.5rem] h-[2.5rem] bg-gray-400 hidden xl:block">
          </div>
          <button
            onClick={handleToggle} // Use handleToggle for animation
            className={`xl:hidden block transition-transform duration-300 ${
              isAnimating ? "rotate-180" : ""
            }`} // Add animation classes
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
