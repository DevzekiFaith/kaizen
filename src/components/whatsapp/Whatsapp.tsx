import React from "react";
import { BsWhatsapp } from "react-icons/bs";

const Whatsapp = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-800 rounded-full shadow-lg p-2 animate-bounce">
      <a
        href="https://wa.me/2347014441418" // WhatsApp direct link
        target="_blank"
        rel="noopener noreferrer"
        title="Message us on WhatsApp"
        className="flex justify-center items-center text-green-600 hover:text-blue-800"
      >
        <BsWhatsapp className="text-3xl" />
      </a>
    </div>
  );
};

export default Whatsapp;
