"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import Link from "next/link";
import { auth } from '@/firebase/firebaseConfig';
 // Use the already initialized auth object

type FormValues = {
  email: string;
};

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error: unknown) {
      toast.error("Failed to send password reset email. Please try again.");
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
    reset();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-400">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-[12px] text-slate-300"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-slate-300 py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          >
            {isLoading ? "Sending..." : "Reset Password"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            href="/signIn"
            className="text-blue-500 hover:text-blue-600 transition duration-300"
          >
            Back to SignIn
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
