"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // {{ edit_1
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";

type FormValues = {
  email: string;
  password: string;
};

const SignIn = () => {
  const router = useRouter();
  const HandleGoogle = async () => {
    const provider = await new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/content");
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>(); // Ensure useForm is correctly imported

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const { email, password } = data;
      const auth = getAuth(); // Initialize auth
      await signInWithEmailAndPassword(auth, email, password); // Updated to use the correct method
      reset();
      alert("Successfully signed in!"); // Updated alert message
      router.push("/content");
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Failed to sign in. Please check your credentials."); // {{ edit_2
    }
  };

  return (
    <div>
      <div className="flex justify-center xl:flex-row flex-col items-center gap-[4rem] w-full p-[1rem]">
        <div>
          <Image
            className="w-[28rem] h-screen"
            src="/cover10.jpg"
            width={300}
            height={300}
            alt="login"
          />
        </div>
        <div>
          <div className="mb-[2rem]">
            <h1 className="text-orange-500 uppercase font-bold text-[22px] w-[26rem] ml-[3rem]">
              Reflectify
            </h1>
          </div>
          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-[26rem] p-[2.8rem]"
            >
              <div className="flex flex-col">
                <span className="flex flex-col">
                  <label className="text-slate-200 mb-[1rem]">Email</label>
                  <input
                    className="w-[24rem] h-[2.5rem] text-slate-500 bg-slate-800 rounded-3xl px-6 text-[12px] "
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", { required: true })} // {{ edit_1
                  />
                  {errors.email?.type === "required" && (
                    <p className="text-red-500" role="alert">
                      email is required
                    </p>
                  )}
                </span>
                <span className="flex flex-col">
                  <label className="text-slate-200 mb-[.9rem] mt-[.9rem]">
                    Password
                  </label>
                  <input
                    className="w-[24rem] h-[2.5rem] text-slate-300 bg-slate-800 rounded-3xl px-6 text-[12px]"
                    type="password" // Changed to lowercase
                    placeholder="Enter your password" // Added
                    {...register("password", { required: true })}
                  />
                  {errors.password?.type === "required" && (
                    <p className="text-red-500" role="alert">
                      Password is required
                    </p>
                  )}
                </span>
              </div>
              <span className="mt-[1rem]">
                <h6 className="text-slate-400 text-[10px] text-center pt-[12px] ml-[3rem]">
                  By signing up, you accept our{" "}
                  <span className="text-green-700">Terms and Conditions</span>
                </h6>
              </span>
              <div>
                <button className="bg-orange-600 w-[24rem] h-[2.5rem] mt-[1.2rem] rounded-3xl text-slate-300 font-bold">
                  Sign In
                </button>
              </div>
              <div className=" mt-[1.5rem]">
                <h6 className="text-slate-600 text-center ml-[3rem] text-[12px]">
                  Don't have an account?{" "}
                  <Link href="/signUp">
                    <span className="cursor-pointer text-green-500">
                      Sign Up
                    </span>
                  </Link>
                </h6>
              </div>
              <div className="flex justify-center items-align mt-[1.5rem] ml-[3rem]">
                <span>
                  <hr className="bg-slate-400  w-[6rem] mt-[9px] mr-3" />
                </span>
                <h1 className="text-slate-400">OR</h1>
                <span>
                  <hr className="bg-slate-400  w-[6rem] mt-[9px] ml-3" />
                </span>
              </div>
            </form>
          </div>
          <div className="flex justify-center items-center gap-[6px] bg-transparent border-2 border-white w-[24rem] h-[2.5rem] rounded-3xl mt-[1.2rem] ml-[3rem]">
            <Image src="/Frame.png" width={20} height={20} alt="origin" />
            <button
              onClick={HandleGoogle}
              className="text-slate-400 text-[12px]"
            >
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
