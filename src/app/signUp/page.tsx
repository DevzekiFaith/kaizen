"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cover12 from "../../../Public/images/cover12.jpg";
import Frame from "../../../Public/images/Frame.png";

async function addDataToFireStore(name: string, email: string) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name,
      email,
    });
    console.log("Document written with ID: ", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
    toast.error("Failed to create user data. Please try again.");
    return false;
  }
}

type FormValues = {
  name: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const HandleGoogle = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        // Add user data to Firestore
        await addDataToFireStore(
          result.user.displayName || "Unknown",
          result.user.email || "No email"
        );
        
        toast.success("Successfully signed in with Google!");
        // Delay navigation slightly to allow toast to show
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error instanceof FirebaseError 
        ? error.message 
        : "Failed to sign in with Google";
      toast.error(errorMessage);
      console.error("Google sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      const success = await addDataToFireStore(data.name, data.email);
      if (success) {
        toast.success("Account created successfully!");
        reset();
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error instanceof FirebaseError 
        ? error.message 
        : "An unknown error occurred";
      toast.error("Error signing up: " + errorMessage);
      console.error("Error signing up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user.email);
      } else {
        console.log("No user is signed in.");
      }
    });
    return () => unsubscribe();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      <div className="flex justify-center xl:flex-row flex-col items-center gap-[4rem] w-full p-[1rem]">
        <div>
          <Image
            className="w-[28rem] h-screen"
            src={Cover12}
            width={300}
            height={300}
            alt="cover"
          />
        </div>
        <div className="mt-[5rem]">
          <div className="mb-[2rem]">
            <h1 className="text-orange-500 uppercase font-bold text-[22px] w-[26rem] ml-[3rem] animate-pulse">
              Reflectify
            </h1>
          </div>
          <div>
            <div className="flex justify-between items-align w-[26rem]">
              <h5 className="text-slate-700 text-[16px] w-[26rem] ml-[3rem] pt-[4px] mb-[-2rem]">
                Create your Account
              </h5>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-[26rem] p-[2.8rem]"
            >
              <div className="flex flex-col">
                <span className="flex flex-col">
                  <label className="text-slate-200 mb-[.9rem] mt-[.9rem]">
                    Name
                  </label>
                  <input
                    className="w-[24rem] h-[2.5rem] text-slate-300 bg-slate-800 rounded-3xl px-6 text-[12px] mb-1"
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    {...register("name", { required: true })}
                  />
                  {errors.name?.type === "required" && (
                    <p className="text-red-500 mb-[1rem]" role="alert">
                      Name is required
                    </p>
                  )}
                </span>
                <span className="flex flex-col">
                  <label className="text-slate-200 mb-[1rem]">Email</label>
                  <input
                    className="w-[24rem] h-[2.5rem] text-slate-500 bg-slate-800 rounded-3xl px-6 text-[12px]"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    {...register("email", { required: true })}
                  />
                  {errors.email?.type === "required" && (
                    <p className="text-red-500" role="alert">
                      Email is required
                    </p>
                  )}
                </span>
                <span className="flex flex-col">
                  <label className="text-slate-200 mb-[.9rem] mt-[.9rem]">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="w-[24rem] h-[2.5rem] text-slate-300 bg-slate-800 rounded-3xl px-6 text-[12px]"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Create your password"
                      {...register("password", { required: true })}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-2 top-2"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <span className="text-slate-300 w-[18px] h-[18px]">
                          👁️
                        </span>
                      ) : (
                        <span className="text-slate-300 w-[28px] h-[28px]">
                          👁️‍🗨️
                        </span>
                      )}
                    </button>
                  </div>
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
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-orange-600 w-[24rem] h-[2.5rem] mt-[1.2rem] rounded-3xl text-slate-300 font-bold ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700'
                  }`}
                >
                  {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
              </div>
              <div className="ml-[3rem] mt-[1.5rem]">
                <h6 className="text-slate-600 text-center text-[12px]">
                  Already have an account?{" "}
                  <Link href="/signIn">
                    <span className="cursor-pointer text-green-500">
                      Sign In
                    </span>
                  </Link>
                </h6>
              </div>
              <div className="flex justify-center items-align mt-[1.5rem] ml-[3rem]">
                <span>
                  <hr className="bg-slate-400 w-[6rem] mt-[9px] mr-3" />
                </span>
                <h1 className="text-slate-400">OR</h1>
                <span>
                  <hr className="bg-slate-400 w-[6rem] mt-[9px] ml-3" />
                </span>
              </div>
            </form>
          </div>
          <div className="flex justify-center items-center gap-[6px] bg-transparent border-2 border-white w-[24rem] h-[2.5rem] rounded-3xl mt-[1.2rem] ml-[3rem]">
            <Image
              src={Frame}
              width={48}
              height={48}
              alt="Frame"
              className="w-[20px] h-[20px]"
            />
            <button
              onClick={HandleGoogle}
              disabled={isLoading}
              type="button"
              className={`text-slate-400 text-[12px] ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-slate-300'
              }`}
            >
              {isLoading ? 'Connecting...' : 'Continue with Google'}
            </button>
          </div>
        </div>
        <ToastContainer
          position="top-center"
          limit={1}
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Zoom}
        />
      </div>
    </div>
  );
};

export default SignUp;
