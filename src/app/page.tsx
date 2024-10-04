"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle } from "react-icons/io";
// import ImageUpload from "@/components/ImageUpload/ImageUpload";
// import { useRouter } from "next/navigation";

const images = ["/cover32.jpg", "/cover28.jpg", "/cover31.jpg"];

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-800">
      <h1 className="text-[16px] font-extrabold text-orange-600 mb-6 absolute top-[10rem] xl:left-[28rem] z-50 uppercase">
        Reflectify!
      </h1>

      <div className="relative mb-8">
        <Image
          src={images[currentImageIndex]}
          alt="Welcome"
          width={600}
          height={400}
          className="rounded-lg shadow-lg transition-transform duration-500"
        />
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black rounded-full p-2 shadow hover:bg-gray-200 transition"
          aria-label="Previous Image"
        >
          <IoIosArrowDropleftCircle className="w-[44px] h-[44px]" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black rounded-full p-2 shadow hover:bg-gray-200 transition"
          aria-label="Next image"
        >
          <IoIosArrowDroprightCircle className="w-[44px] h-[44px]" />
        </button>
      </div>

      <p className="text-[12px] mb-10 text-center max-w-md text-slate-600">
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
              Access your daily reflections and insights Lorem ipsum dolor, sit
              amet consectetur adipisicing elit. Voluptatibus tempore tenetur
              perspiciatis.
            </p>
          </div>
        </Link>
        <Link href="/signIn">
          <div className="bg-slate-950 text-slate-600 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl shadow-slate-800">
            <h2 className="text-xl font-bold mb-2 text-orange-600">
              Weekly Summary
            </h2>
            <p>
              View and edit your personal information Lorem ipsum dolor, sit
              amet consectetur adipisicing elit. Voluptatibus tempore tenetur
              perspiciatis.
            </p>
          </div>
        </Link>
        <Link href="/signIn">
          <div className="bg-slate-950 text-slate-600 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl shadow-slate-800 mb-[2rem]">
            <h2 className="text-xl font-bold mb-2 text-orange-600">Settings</h2>
            <p>
              Customize your experience and preferences Lorem ipsum dolor, sit
              amet consectetur adipisicing elit. Voluptatibus tempore tenetur
              perspiciatis.
            </p>
          </div>
        </Link>
      </div>
      {/* <div>
        <ImageUpload />
      </div> */}
    </div>
  );
};

export default Home;
