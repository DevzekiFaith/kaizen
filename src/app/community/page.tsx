"use client";

import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar/NavBar";
import Modal from "@/components/Modal/Modal";
import { Footer } from "@/components/Footer/Footer";
import { Rating, CommunityStats } from "@/types/community";
import {
  submitRating,
  subscribeToRatings,
  subscribeToCommunityStats,
} from "@/firebase/community";
import { auth } from "@/firebase/firebaseConfig";

export default function CommunityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [inclusionRating, setInclusionRating] = useState(5);
  const [productivityRating, setProductivityRating] = useState(5);
  const [comment, setComment] = useState("");

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    const unsubscribeRatings = subscribeToRatings((newRatings) => {
      setRatings(newRatings);
    });

    const unsubscribeStats = subscribeToCommunityStats((newStats) => {
      setStats(newStats);
    });

    return () => {
      unsubscribeRatings();
      unsubscribeStats();
    };
  }, []);

  const handleSubmitRating = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to submit ratings");
      return;
    }

    const rating: Rating = {
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      timestamp: Date.now(),
      inclusionRating,
      productivityRating,
      comment: comment.trim() || undefined,
    };

    await submitRating(rating);
    setComment("");
  };

  return (
    <main className="">
      <div>
        <NavBar onToggleModal={toggleModal} />
      </div>
      <div>
        <Modal
          isOpen={isModalOpen}
          onClose={toggleModal}
          toggleTheme={() => {}}
        />
      </div>

      <div className="container mx-auto px-4 py-8 pt-[10rem] ">
        <div className="wrapper mb-8">
          <div className="typing-demo text-slate-500 p-3 text-[14px]">
            Community Ratings & Feedback
          </div>
        </div>

        {/* Community Stats */}
        {stats && (
          <div className="border-4 border-slate-700 rounded-xl p-[1rem] mb-8 w-full">
            <h2 className="text-xl font-semibold mb-4 text-slate-500">
              Community Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-600 text-[12px]">
                  Average Inclusion Rating
                </p>
                <p className="text-2xl font-bold text-orange-500">
                  {stats.averageInclusion.toFixed(1)}/10
                </p>
              </div>
              <div>
                <p className="text-slate-600 text-[12px]">
                  Average Productivity Rating
                </p>
                <p className="text-2xl font-bold text-orange-500">
                  {stats.averageProductivity.toFixed(1)}/10
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-600 text-[12px]">Total Ratings</p>
                <p className="text-2xl font-bold text-orange-500">
                  {stats.totalRatings}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rating Form */}
        {auth.currentUser && (
          <div className="border-4 border-slate-700 rounded-xl p-[1rem] mb-8 w-full">
            <h2 className="text-xl font-semibold mb-4 text-slate-500">
              Submit Your Rating
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="inclusionRating"
                  className="block text-sm font-medium text-slate-600 text-[12px]"
                >
                  Inclusion Rating
                </label>
                <input
                  id="inclusionRating"
                  type="range"
                  min="1"
                  max="10"
                  value={inclusionRating}
                  onChange={(e) => setInclusionRating(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <span className="text-sm text-slate-500">
                  {inclusionRating}/10
                </span>
              </div>
              <div>
                <label
                  htmlFor="productivityRating"
                  className="block text-sm font-medium text-slate-600 text-[12px]"
                >
                  Productivity Rating
                </label>
                <input
                  id="productivityRating"
                  type="range"
                  min="1"
                  max="10"
                  value={productivityRating}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProductivityRating(Number(e.target.value))
                  }
                  className="w-full accent-orange-500"
                />
                <span className="text-sm text-slate-500">
                  {productivityRating}/10
                </span>
              </div>
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-slate-600 text-[12px]"
                >
                  Comment (Optional)
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1 block w-full rounded-2xl border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-[12px] text-slate-600 p-[8px]"
                  rows={3}
                />
              </div>
              <button
                onClick={handleSubmitRating}
                className="flex justify-center items-center bg-transparent border border-slate-800 p-[3px] rounded-full h-[2.5rem] font-extrabold w-full text-orange-500 hover:translate-x-5"
              >
                Submit Rating
              </button>
            </div>
          </div>
        )}

        {/* Recent Ratings */}
        <div className="border-4 border-slate-700 rounded-xl p-[1rem] w-full">
          <h2 className="text-xl font-semibold mb-4 text-slate-500">
            Recent Community Ratings
          </h2>
          <div className="space-y-4">
            {ratings.map((rating, index) => (
              <div key={index} className="border-b border-slate-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-600 text-[12px]">
                      {rating.userName}
                    </p>
                    <p className="text-sm text-slate-500 text-[10px]">
                      {new Date(rating.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-600 text-[12px]">
                      Inclusion: {rating.inclusionRating}/10
                    </p>
                    <p className="text-slate-600 text-[12px]">
                      Productivity: {rating.productivityRating}/10
                    </p>
                  </div>
                </div>
                {rating.comment && (
                  <p className="mt-2 text-slate-600 text-[12px]">
                    {rating.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </main>
  );
}
