"use client";
// import React from 'react'

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"; // Correct for v7+
import Image from "next/image";
import TimeTracker from "@/components/Time-Tracker/Time-Tracker";
import NavBar from "@/components/NavBar/NavBar";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal"; // Import useRouter for navigation

type FormValues = {
  date: string;
  title: string;
  content: string;
  goal: string;
};

const MainPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    reset();
    alert("just Dropped my Schedule for the Day! SUPER-EXCITED");
    // Moved reset inside onSubmit
    const queryString = new URLSearchParams(data).toString();
    router.push(`/dailyJournal?${queryString}`);
  };
  return (
    <main>
      <div>
        <NavBar onToggleModal={toggleModal} />
      </div>
      <div>
        <Modal
          isOpen={isModalOpen}
          onClose={toggleModal}
          toggleTheme={toggleTheme}
        />
      </div>
      <div className="flex justify-center items-center flex-col xl:flex-row gap-[4rem] pt-[10rem]">
        <div>
          <div className="border-4 border-slate-700 rounded-xl p-[1rem]">
            {" "}
            {/* Fixed typo here */}
            <h1 className="p-[4px] xl:w-[400px] dark:text-slate-800 text-slate-600 text-[12px]">
              Journaling your daily progress helps you see how far you have come
              and what you still need to work on. It allows you to break down
              big tasks into smaller, more manageable steps. By writing down
              your thoughts, goals, and achievements each day, you stay more
              organized and focused.

              It is also a great way to stay motivated. When you look back at
              what you have achieved, it can boost your confidence and push you to
              do even better. Plus, it helps build good habits that are key to
              reaching your goals.
            </h1>
          </div>
          <div>

          <div className="p-[1.5rem] ml-[1.5rem]">
            <Image
              className=""
              src="/images/cover14.jpg"
              width={300}
              height={300}
              alt="Poster"
            />
          </div>
          <div className="p-[1.5rem] ml-[1.5rem]">
            <Image
              className=""
              src="/images/og.png"
              width={300}
              height={300}
              alt="Poster"
            />
          </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <span className="flex flex-col mb-[1.5rem] ">
              <label className="text-slate-500 text-[12px]">Date</label>
              <input
                className="text-slate-800 text-[12px] p-[8px] rounded-2xl"
                type="datetime-local"
                placeholder="date"
                {...register("date", { required: true })}
              />
              {errors.date?.type === "required" && (
                <p className="text-red-500 text-[10px]" role="alert">
                  date is required
                </p>
              )}
            </span>
            <span className="flex justify-start items-center mb-[1rem] gap-[1rem]">
              <label className="text-slate-600 text-[12px]">Goal</label>{" "}
              {/* Added htmlFor */}
              <input
                id="goal" // Added id for accessibility
                className="text-white text-[12px] p-[8px] rounded-full accent-orange-500"
                type="checkbox"
                placeholder="goals"
                {...register("goal", { required: true })}
              />
              {errors.goal?.type === "required" && (
                <p className="text-red-500 text-[10px]" role="alert">
                  goal is required
                </p>
              )}
              <h6 className="text-slate-400 text-[12px]">
                Mark your goal for your daily attraction!
              </h6>
            </span>

            <span className="flex flex-col mb-[1.5rem] ">
              <label className="text-slate-500 text-[12px]">Title</label>
              <input
                className="text-slate-400 text-[12px] p-[8px] rounded-2xl"
                type="text"
                placeholder="title of goal"
                {...register("title", { required: true })}
              />
              {errors.title?.type === "required" && (
                <p className="text-red-500 text-[10px]" role="alert">
                  title is required
                </p>
              )}
            </span>
            <span className="flex flex-col mb-[1.5rem] ">
              <label htmlFor="">Category</label>
              <div>
                <div>
                  <div>
                    <div>
                      <div className="mb-[1rem]">
                        <label className="text-slate-400 text-[12px]">
                          Activity
                        </label>
                      </div>
                      <select
                        className="bg-slate-500 text-[12px] p-[8px] rounded-2xl xl:w-[24rem] w-[18rem] h-[2.5rem]"
                        id="Activities"
                        name="Progress Work"
                        title="Progress Work"
                      >
                        <option value="Eating">Eating</option>
                        <option value="Exercise">Exercise</option>
                        <option value="Reading">Reading</option>
                        <option value="free Time">Free Time</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-[1rem]">
                <TimeTracker />
              </div>
            </span>
            <span className="flex flex-col">
              <label htmlFor="">Content</label>
              <textarea
                className="text-white text-[12px] p-[8px] rounded-2xl h-[14rem]"
                placeholder="content"
                {...register("content", { required: true })}
              ></textarea>
              {errors.content?.type === "required" && (
                <p className="text-red-500 text-[10px]" role="alert">
                  Content is required
                </p>
              )}
            </span>
          </div>
          <button
            type="submit"
            className="flex  justify-center gap-[1.5rem]  items-center bg-transparent border border-slate-800 p-[3px] mt-[2rem] xl:w-[24rem] rounded-full h-[2.5rem] font-extrabold w-[16rem] text-orange-500 hover:translate-x-5"
          >
            Lets Go!{" "}
            <FaArrowUpRightFromSquare className="text-slate-800 translate-x-3 cursor-pointer hover:translate-x-6" />
          </button>
          <div className="border-4 border-slate-700 border-l-slate-500w-[200px] mt-[2rem] rounded-2xl">
            <h5 className="w-[300px] p-[8px] dark:text-slate-800 text-slate-600 text-[12px] text-center xl:ml-[3rem]">
            Over time, journaling not only helps with productivity but also allows you to recognize your own growth. When you look back, you can see how far you’ve come, and that reflection can serve as inspiration to keep pushing forward.
            </h5>
          </div>
        </form>
      </div>
    </main>
  );
};

export default MainPage;
