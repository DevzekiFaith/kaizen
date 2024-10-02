"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaAlignJustify } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../Toggle/ModeToggle";
import { UserButton } from "@clerk/nextjs";
import { SignedIn } from "@clerk/clerk-react";
import ImageUpload from "../ImageUpload/ImageUpload";
// import { useState } from "react";

const navLinks = [
  { name: "home", path: "/" },
  { name: "daily journal", path: "/dailyJournal" },
  { name: "weekly Summary", path: "/weeklySummary" },
];

export default function NavBar() {
  // Get the current path from the router
  const currentPath = usePathname();

  // Function to check if a given path is the current path
  const isActive = (path: string): boolean => {
    return currentPath === path;
  };

  return (
    <div className="fixed w-full bg-black mt-[-1.5rem]">
      <div className="flex justify-between items-center p-[2rem]">
        <div>
          <Link href="/">
            <h1 className="text-extrabold text-orange-500">REFLECTIFY</h1>
          </Link>
        </div>
        <div className="xl:block hidden">
          <React.Fragment>
            <ul className="flex justify-center items-center gap-2">
              {navLinks.map((pages, index) => (
                <li key={index}>
                  <Link
                    href={pages.path}
                    className={
                      isActive(pages.path)
                        ? "bg-orange-500 text-white p-[8px] rounded-2xl text-[12px] "
                        : "text-slate-500 hover:text-slate-800"
                    }
                  >
                    {pages.name}
                  </Link>
                </li>
              ))}
            </ul>
          </React.Fragment>
        </div>
        {/* <SignedIn>
          <UserButton showName />
        </SignedIn>  */}

        <div className="flex justify-center items-center gap-2">
          <Link href="/signIn">
            <button className="mr-[1rem] border-1 bg-orange-500 p-[6px] w-[4rem] rounded-full text-bold text-slate-300">
              {" "}
              logout
            </button>
          </Link>

          <div className="rounded-full w-[2.5rem] h-[2.5rem] bg-gray-400">
            <ImageUpload />
          </div>
          <div className="xl:hidden block">
            <FaAlignJustify className="text-white text-[1.5rem]" />
          </div>
          <div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
