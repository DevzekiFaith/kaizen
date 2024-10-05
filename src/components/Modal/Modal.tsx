import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  toggleTheme: () => void; // Ensure this prop is used if needed
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose}) => { // Added toggleTheme to props
  const currentPath = usePathname(); // Get the current path

  // Function to check if a given path is the current path
  const isActive = (path: string): boolean => {
    return currentPath === path;
  };

  return (
    <div className="">
      <div
        className={`fixed inset-0 bg-black bg-opacity-70 z-50  transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent rounded-lg shadow-lg p-5 h-[18rem] text-slate-400 border-2 border-slate-700 w-[16rem] transition-transform ${
            isOpen ? "scale-100" : "scale-95"
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-slate-300 rounded-full p-[12px] transition-transform duration-300 hover:scale-110 hover:bg-orange-600" // Added hover effects
            aria-label="Close modal"
          >
            ✖
          </button>
          <h2 className="text-lg font-bold mb-4">Menu</h2>
          <ul className="flex flex-col space-y-2">
            <li>
              <Link
                href="/"
                className={`block ${
                  isActive("/") ? "text-orange-500" : "text-slate-400"
                } hover:text-orange-500`}
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
              >
                Weekly Journal
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className={`block ${
                  isActive("/profile") ? "text-orange-500" : "text-slate-400"
                } hover:text-orange-500`}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link href="/signIn">
                <button className="mt-4 border-1 bg-orange-500 p-2 rounded-full font-bold text-slate-200">
                  Logout
                </button>
              </Link>
            </li>
          </ul>
          {/* <div className="mt-4">
            <button onClick={toggleTheme} className="border-1 p-2 rounded-full">
              Toggle Dark/Light Theme
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Modal;
