"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
// import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cover12 from "../../../Public/images/cover12.jpg";
import Frame from "../../../Public/images/Frame.png";
import { useRouter } from "next/navigation";

// Firestore data addition helper
async function addDataToFireStore(name: string, email: string) {
  try {
    const docRef = await addDoc(collection(db, "users"), { name, email });
    console.log("Document written with ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding document:", error);
    toast.error("Failed to create user data. Please check your permissions.");
    return false;
  }
}

// Define form data structure
type FormValues = {
  name: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Toast notification function
  const notify = (message: string, type: "success" | "error") =>
    toast(message, { type });

  // Google sign-in handler
  const HandleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);
      notify("Signed in successfully!", "success");
      router.push("/signIn");
    } catch (error) {
      console.error("Google sign-in error:", error);
      notify("Google sign-in failed. Please try again.", "error");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  // Sign-up handler
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("User signed up:", userCredential.user);
      reset();
      notify("Account created successfully!", "success");

      const success = await addDataToFireStore(data.name, data.email);
      if (success) router.push("/signIn");
    } catch (error) {
      console.error("Error signing up:", error);
      const errorMessage =
        (error as FirebaseError).message || "An unknown error occurred.";
      notify(`Error signing up: ${errorMessage}`, "error");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user ? "User is signed in:" : "No user is signed in.", user);
    });
    return () => unsubscribe();
  }, []);

  const togglePasswordVisibility = () =>
    setShowPassword((prev) => !prev);

  return (
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Name"
              className="input-field"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              type="email"
              className="input-field"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4 relative">
            <input
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="input-field"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded-lg"
          >
            Sign Up
          </button>
        </form>

        <div className="flex justify-center items-center gap-[6px] bg-transparent border-2 border-white w-[24rem] h-[2.5rem] rounded-3xl mt-[1.2rem] ml-[3rem]">
          <Image
            src={Frame}
            width={48}
            height={48}
            alt="Frame"
            placeholder="blur"
            className="w-[20px] h-[20px]"
          />
          <button
            onClick={HandleGoogle}
            className="text-slate-400 text-[12px]"
          >
            Continue with Google
          </button>
        </div>

        <ToastContainer
          position="top-center"
          limit={1}
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop
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
