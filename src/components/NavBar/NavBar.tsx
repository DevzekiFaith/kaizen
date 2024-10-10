"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaAlignJustify } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../Toggle/ModeToggle";
import { logout } from "../../../utils/auth";
import NotificationBell from "@/components/NotificationBell/NotificationBell";
// import NotificationBell from "@/components/"

const navLinks = [
  { name: "home", path: "/" },
  { name: "daily journal", path: "/dailyJournal" },
  { name: "weekly Summary", path: "/weeklySummary" },
];

interface NavBarProps {
  onToggleModal: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onToggleModal }) => {
  const currentPath = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);

  const isActive = (path: string): boolean => {
    return currentPath === path;
  };

  const handleToggle = () => {
    setIsAnimating(true);
    onToggleModal();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="fixed w-full bg-black mt-[-2rem] z-[100]">
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
          <button
            onClick={logout}
            className="mr-[1rem] border-1 bg-orange-500 p-[6px] w-[4rem] rounded-full font-bold text-slate-300 xl:block hidden"
          >
            logout
          </button>

          <div className="rounded-full w-[2.5rem] h-[2.5rem] bg-gray-400 hidden xl:block"></div>
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
