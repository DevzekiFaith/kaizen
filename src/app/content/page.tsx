"use client";
// import React from 'react'

import React from "react";
import Categories from "@/components/categories/Categories";
import { useForm, SubmitHandler } from "react-hook-form"; // Correct for v7+
import Image from "next/image";
import TimeTracker from "@/components/Time-Tracker/Time-Tracker";
import NavBar from "@/components/NavBar/NavBar";

type FormValues = {
  date: string; // Added line
  title: string;
  content: string; // Added line
};

const MainPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    reset();
    alert("just Dropped my Schedule for the Day! SUPER-EXCITED"); // Moved reset inside onSubmit
  };
  return (
    <main>
      <div>
        <NavBar />
      </div>
      <div className="flex justify-center items-center flex-col xl:flex-row gap-[4rem] pt-[10rem]">
        <div>
          <div className=" border-4 border-slate-700 border-l-indigo-500rounded-xl rounded-2xl p-[1rem]">
            <h1 className="p-[4px] xl:w-[400px] dark:text-slate-800 text-slate-600 text-[12px]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perferendis nihil odio voluptatum, mollitia temporibus
              dignissimos, neque maiores quaerat asperiores rem voluptatem ea
              fugit blanditiis optio officiis placeat! Error laudantium qui ipsa
              non aliquid quis maxime accusamus sint voluptatem deserunt
              quibusdam consequatur autem
            </h1>
          </div>
          <div className="p-[1.5rem] ml-[1.5rem]">
            <Image
              className=""
              src="/cover14.jpg"
              width={300}
              height={300}
              alt="Poster"
            />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <span className="flex flex-col mb-[1.5rem] ">
              <label htmlFor="">Date</label>
              <input
                className="text-slate-800 text-[12px] p-[8px] rounded-2xl"
                type="datetime-local"
                placeholder="date"
                {...register("date", { required: true })}
              />
              {errors.date?.type === "required" && (
                <p className="text-red-500" role="alert">
                  date is required
                </p>
              )}
            </span>

            <span className="flex flex-col mb-[1.5rem] ">
              <label htmlFor="">Title</label>
              <input
                className="text-slate-800 text-[12px] p-[8px] rounded-2xl"
                type="text"
                placeholder="title"
                {...register("title", { required: true })}
              />
              {errors.title?.type === "required" && (
                <p className="text-red-500" role="alert">
                  title is required
                </p>
              )}
            </span>
            <span className="flex flex-col mb-[1.5rem] ">
              <label htmlFor="">Category</label>
              <div>
                <Categories />
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
                <p className="text-red-500" role="alert">
                  Content is required
                </p>
              )}
            </span>
          </div>
          <button
            type="submit"
            className="bg-orange-500 p-[3px] mt-[2rem] xl:w-[24rem] rounded-full h-[2.5rem] font-extrabold w-[16rem] text-slate-300"
          >
            Lets Go!
          </button>
          <div className="border-4 border-slate-700 border-l-slate-500w-[200px] mt-[2rem] rounded-2xl">
            <h5 className="w-[300px] p-[8px] dark:text-slate-800 text-slate-600 text-[12px]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
              amet iure accusamus ipsa corrupti. Quasi voluptates consectetur.
            </h5>
          </div>
        </form>
      </div>
    </main>
  );
};

export default MainPage;
