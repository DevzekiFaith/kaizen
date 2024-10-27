import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { auth } from "@/firebase/firebaseConfig";
import { useState, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  toggleTheme: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const currentPath = usePathname();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(user.displayName);
        setPhotoURL(user.photoURL);
      } else {
        setDisplayName(null);
        setPhotoURL(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const isActive = (path: string): boolean => {
    return currentPath === path;
  };

  const handleSettingsClick = () => {
    onClose(); // Close the modal when navigating to settings
  };

  return (
    <div className="">
      <div
        className={`fixed inset-0 bg-black bg-opacity-70 z-50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent rounded-lg shadow-lg p-5 h-[20rem] text-slate-400 border-2 border-slate-700 w-[16rem] transition-transform ${
            isOpen ? "scale-100" : "scale-95"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-2 right-2 text-slate-300 rounded-full p-[12px] transition-transform duration-300 hover:scale-110 hover:bg-orange-600"
            aria-label="Close modal"
          >
            ✖
          </button>

          {/* Profile Section */}
          <Link href="/settings" onClick={handleSettingsClick}>
            <div className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80">
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
              {displayName && (
                <span className="text-slate-300 text-sm truncate max-w-[120px]">
                  {displayName}
                </span>
              )}
            </div>
          </Link>

          <h2 className="text-lg font-bold mb-4">Menu</h2>
          <ul className="flex flex-col space-y-2">
            <li>
              <Link
                href="/"
                className={`block ${
                  isActive("/") ? "text-orange-500" : "text-slate-400"
                } hover:text-orange-500`}
                onClick={onClose}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dailyJournal"
                className={`block ${
                  isActive("/dailyJournal")
                    ? "text-orange-500"
                    : "text-slate-400"
                } hover:text-orange-500`}
                onClick={onClose}
              >
                Daily Journal
              </Link>
            </li>
            <li>
              <Link
                href="/weeklySummary"
                className={`block ${
                  isActive("/weeklySummary")
                    ? "text-orange-500"
                    : "text-slate-400"
                } hover:text-orange-500`}
                onClick={onClose}
              >
                Weekly Journal
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className={`block ${
                  isActive("/dashboard") ? "text-orange-500" : "text-slate-400"
                } hover:text-orange-500`}
                onClick={onClose}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/signIn"
                onClick={onClose}
              >
                <button className="mt-4 border-1 bg-orange-500 p-2 rounded-full font-bold text-slate-200">
                  Logout
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Modal;
