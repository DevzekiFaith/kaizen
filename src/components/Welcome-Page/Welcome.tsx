import React from "react";
import Image from "next/image";
import { FaArrowCircleRight } from "react-icons/fa";

export default function Welcome() {
  return (
    <div className="flex  flex-col justify-center items-center">
      <div>
        <h1>Welcome!</h1>
      </div>
      <div>
        <Image className="relative" src="/cover10.jpg" width={300} height={600} alt="welcome!" />
      </div>
      <div className="bg-[#222d30] bg-transparent p-[12px] w-[18rem] rounded-2xl cursor-pointer flex justify-end items-center gap-[12px] mt-[1.2rem] border border-slate-600 absolute">
        <button className=" text-slate-200 font-bold text-[14px]">Next</button>
        <FaArrowCircleRight className="text-slate-200 text-[18px] hover:translate-x-0.5 cursor-pointer" />
      </div>
    </div>
  );
}
