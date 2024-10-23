"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import NavBar from "@/components/NavBar/NavBar";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import Cover14 from "../../../Public/images/cover14.jpg";
import Badge from "@/components/Badge/Badge";
import Link from "next/link";

interface FormValues {
  date: string;
  title: string;
  content: string;
  goal: string;
  weeklySummary: string;
}

const MainPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [milestones, setMilestones] = useState<string[]>([]);
  const [dailyShareImage, setDailyShareImage] = useState<string>("");
  const [weeklyShareImage, setWeeklyShareImage] = useState<string>("");
  const [imagesReady, setImagesReady] = useState(false);
  // const [selectedDate, setSelectedDate] = useState("");

  const toggleModal = useCallback(
    () => setIsModalOpen(!isModalOpen),
    [isModalOpen]
  );
  const toggleTheme = useCallback(
    () => setIsDarkTheme(!isDarkTheme),
    [isDarkTheme]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      Notification.requestPermission();
    }
  }, []);

  const notifyMilestone = useCallback((milestone: string): void => {
    if (
      typeof window !== "undefined" &&
      Notification.permission === "granted"
    ) {
      new Notification(`Milestone Reached: ${milestone}`);
    }
  }, []);

  const checkMilestones = useCallback(
    (data: FormValues): void => {
      const newMilestones: string[] = [];
      if (data.content.length > 100) {
        newMilestones.push("100+ characters");
        notifyMilestone("100+ characters");
      }
      if (data.goal === "true") {
        newMilestones.push("Goal set");
        notifyMilestone("Goal set");
      }
      if (data.content.length > 500) newMilestones.push("500 words written");
      if (data.weeklySummary.length > 200)
        newMilestones.push("Detailed weekly summary");
      setMilestones(newMilestones);
    },
    [notifyMilestone]
  );

  // const handleDateChange = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setSelectedDate(e.target.value);
  //   },
  //   []
  // );

  const generateShareableImage = useCallback(
    async (data: FormValues, isWeekly = false): Promise<string> => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "24px Arial";
      ctx.fillStyle = "black";

      ctx.fillText(isWeekly ? "Weekly Summary" : "Daily Goals", 50, 50);

      const content = isWeekly ? data.weeklySummary : data.content;
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        ctx.fillText(line, 50, 100 + index * 30);
      });

      return canvas.toDataURL();
    },
    []
  );

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      console.log(data);
      checkMilestones(data);

      const storedEntries = JSON.parse(
        localStorage.getItem("journalEntries") || "[]"
      );
      storedEntries.push(data);
      localStorage.setItem("journalEntries", JSON.stringify(storedEntries));

      const dailyImage = await generateShareableImage(data);
      const weeklyImage = await generateShareableImage(data, true);

      setDailyShareImage(dailyImage);
      setWeeklyShareImage(weeklyImage);
      setImagesReady(true);

      console.log("Daily image URL:", dailyImage);
      console.log("Weekly image URL:", weeklyImage);

      reset();
      alert("Just Dropped my Schedule for the Day! SUPER-EXCITED");
      const queryString = new URLSearchParams(
        Object.entries(data).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      router.push(`/dailyJournal?${queryString}`);
    },
    [checkMilestones, generateShareableImage, reset, router]
  );

  const downloadImage = useCallback((imageUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const ShareButtons = useCallback(
    ({
      dailyImage,
      weeklyImage,
    }: {
      dailyImage: string;
      weeklyImage: string;
    }) => (
      <div className="mt-4 mb-5 bg-transparent flex justify-center items-center">
        <button
          onClick={() =>
            dailyImage && downloadImage(dailyImage, "daily-goals.png")
          }
          className="bg-transparent border rounded-2xl text-[10px] text-slate-600 px-4 py-2 mr-2"
          disabled={!dailyImage || !imagesReady}
        >
          Download Daily Goals
        </button>
        <button
          onClick={() =>
            weeklyImage && downloadImage(weeklyImage, "weekly-summary.png")
          }
          className="bg-transparent border rounded-2xl px-4 py-2 text-[10px] text-slate-600"
          disabled={!weeklyImage || !imagesReady}
        >
          Download Weekly Summary
        </button>
      </div>
    ),
    [downloadImage, imagesReady]
  );

  return (
    <main className="">
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
          <div className="wrapper">
            <div className="typing-demo text-slate-500 p-3 text-[14px]">
              Welcome to Your daily Entry Life Style!
            </div>
          </div>
          <div className="border-4 border-slate-700 rounded-xl p-[1rem]">
            {" "}
            <h1 className="p-[4px] xl:w-[400px] dark:text-slate-800 text-slate-600 text-[12px]">
              Journaling your daily progress helps you see how far you have come
              and what you still need to work on. It allows you to break down
              big tasks into smaller, more manageable steps. By writing down
              your thoughts, goals, and achievements each day, you stay more
              organized and focused. It is also a great way to stay motivated.
              When you look back at what you have achieved, it can boost your
              confidence and push you to do even better. Plus, it helps build
              good habits that are key to reaching your goals.
            </h1>
          </div>
          <div>
            <div className="p-[1.5rem] ml-[1.5rem]">
              <Image
                className=" h-[38rem] w-[20rem]"
                src={Cover14}
                width={300}
                height={300}
                alt="Poster"
                placeholder="blur"
              />
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <span className="flex flex-col mb-[1.5rem] ">
              <label className="text-slate-500 text-[12px]" htmlFor="dateInput">
                Date
              </label>
              <input
                id="dateInput"
                className="text-slate-800 text-[12px] p-[8px] rounded-2xl"
                type="datetime-local"
                placeholder="Select date and time"
                {...register("date", { required: true })}
              />
              {errors.date?.type === "required" && (
                <p className="text-red-500 text-[10px]" role="alert">
                  date is required
                </p>
              )}
            </span>
            <span className="flex justify-start items-center mb-[1rem] gap-[1rem]">
              <label
                className="text-slate-600 text-[12px]"
                htmlFor="goalCheckbox"
              >
                Goal
              </label>{" "}
              <input
                id="goalCheckbox"
                className="text-white text-[12px] p-[8px] rounded-full accent-orange-500"
                type="checkbox"
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
              <label
                className="text-slate-500 text-[12px]"
                htmlFor="titleInput"
              >
                Title
              </label>
              <input
                id="titleInput"
                className="text-slate-400 text-[12px] p-[8px] rounded-2xl"
                type="text"
                placeholder="Enter title of goal"
                {...register("title", { required: true })}
              />
              {errors.title?.type === "required" && (
                <p className="text-red-500 text-[10px]" role="alert">
                  title is required
                </p>
              )}
            </span>
            <span className="flex flex-col mb-[1.5rem] ">
              <label htmlFor="categorySelect">Category</label>
              <div>
                <div>
                  <div>
                    <div>
                      <div className="mb-[1rem]">
                        <label
                          className="text-slate-400 text-[12px]"
                          htmlFor="activitySelect"
                        >
                          Activity
                        </label>
                      </div>
                      <select
                        id="activitySelect"
                        className="bg-slate-500 text-[12px] p-[8px] rounded-2xl xl:w-[24rem] w-[18rem] h-[2.5rem]"
                        name="Progress Work"
                        title="Select your activity"
                      >
                        <option value="">Choose Your Goal</option>
                        <option value="Healthy Eating">Healthy Eating</option>
                        <option value="Healthy Exercise">
                          Healthy Exercise
                        </option>
                        <option value="Reading">Reading</option>
                        <option value="Daily Gratitude">Daily Gratitude</option>
                        <option value="New Learning-Learning">
                          New Learning
                        </option>
                        <option value="Continuos Learning">
                          Continuos Learning
                        </option>
                        <option value="Meditation">Meditation</option>
                        <option value="Financial Management">
                          Financial Management
                        </option>
                        <option value="Mindful Habits">Mindful Habits</option>
                        <option value="Creativity">Creativity</option>
                        <option value="Time Management">Time Management</option>
                        <option value="Emotional Check-in">
                          Emotional Check-in
                        </option>
                        <option value="Hobby Time">Hobby Time</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </span>
            <span className="flex flex-col">
              <label htmlFor="contentTextarea">Content</label>
              <textarea
                id="contentTextarea"
                className="text-white text-[12px] p-[8px] rounded-2xl h-[14rem]"
                placeholder="Enter your content here"
                {...register("content", { required: true })}
              ></textarea>
              {errors.content?.type === "required" && (
                <p className="text-red-500 text-[10px]" role="alert">
                  Content is required
                </p>
              )}
            </span>

            <span className="flex flex-col mb-[1.5rem]">
              <label
                className="text-slate-500 text-[12px] mb-[2rem]"
                htmlFor="weeklySummaryTextarea"
              >
                Weekly Goal Summary
              </label>
              <textarea
                id="weeklySummaryTextarea"
                className="text-slate-400 text-[12px] p-[8px] rounded-2xl h-[5rem]"
                placeholder="Summarize your week's goal"
                {...register("weeklySummary", { required: true })}
              />
              {errors.weeklySummary?.type === "required" && (
                <p className="text-red-500 text-[10px]" role="alert">
                  Weekly summary is required
                </p>
              )}
            </span>
          </div>
          <button
            type="submit"
            className="flex justify-center gap-[1.5rem] items-center bg-transparent border border-slate-800 p-[3px] mt-[2rem] xl:w-[24rem] rounded-full h-[2.5rem] font-extrabold w-[16rem] text-orange-500 hover:translate-x-5"
          >
            Lets Go!{" "}
            <FaArrowUpRightFromSquare className="text-slate-800 translate-x-3 cursor-pointer hover:translate-x-6" />
          </button>
          <div className="border-4 border-slate-700 border-l-slate-500w-[200px] mt-[2rem] rounded-2xl">
            <h5 className="w-[300px] p-[8px] dark:text-slate-800 text-slate-600 text-[12px] text-center xl:ml-[3rem]">
              Over time, journaling not only helps with productivity but also
              allows you to recognize your own growth. When you look back, you
              can see how far you have come, and that reflection can serve as
              inspiration to keep pushing forward.
            </h5>
          </div>
        </form>
      </div>
      <div className="mt-4">
        {milestones.map((milestone, index) => (
          <Badge key={index} milestone={milestone} />
        ))}
      </div>
      <div className="">
        <ShareButtons
          dailyImage={dailyShareImage}
          weeklyImage={weeklyShareImage}
        />
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/weeklySummary"
          className="text-orange-500 hover:text-blue-700"
        >
          View Weekly Summary
        </Link>
      </div>
    </main>
  );
};

export default MainPage;
