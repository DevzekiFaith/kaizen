"use client";

import React, { useEffect, useState } from "react"; // Import useState
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth"; // Ensure this import is present
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons

type FormValues = {
  email: string;
  password: string;
};

const SignIn = () => {
  const notify = () => toast("So good to be here!");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

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
      alert("Failed to sign in. Please check your credentials.");
    }
  };

  useEffect(() => {
    const auth = getAuth(); // Initialize auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
      } else {
        console.log("No user is signed in.");
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []); // Empty dependency array to run only on mount

  toast.success("🦄 Wow! Successfully Signed In", {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Zoom,
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      <div className="flex justify-center xl:flex-row flex-col items-center gap-[4rem] w-full p-[1rem]">
        <div>
          <Image
            className="w-[28rem] h-screen"
            src="/images/cover10.jpg"
            width={300}
            height={300}
            priority
            alt="login"
          />
        </div>
        <div>
          <div className="mb-[2rem]">
            <h1 className="text-orange-500 uppercase font-bold text-[22px] w-[26rem] ml-[3rem]">
              Reflectify!
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
                    {...register("email", { required: true })}
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
                  <div className="relative">
                    <input
                      className="w-[24rem] h-[2.5rem] text-slate-300 bg-slate-800 rounded-3xl px-6 text-[12px]"
                      type={showPassword ? "text" : "password"} // Toggle between text and password
                      placeholder="Enter your password"
                      {...register("password", { required: true })}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute top-2 right-0 "
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-6 w-6  text-slate-400" />
                      ) : (
                        <Eye className="h-6 w-6 text-slate-400" />
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
                  onClick={notify}
                  className="bg-orange-600 w-[24rem] h-[2.5rem] mt-[1.2rem] rounded-3xl text-slate-300 font-bold"
                >
                  Sign In
                </button>
              </div>
              <span className="flex flex-col">
                <Link
                  href="/forget-password"
                  className="text-blue-500 text-sm mt-2 self-end"
                >
                  Forgot Password?
                </Link>
              </span>

              <div className=" mt-[1.5rem]">
                <h6 className="text-slate-600 text-center ml-[3rem] text-[12px]">
                  Do not have an account?{" "}
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
            <Image
              className="h-[1rem] w-[1rem]"
              src="/images/Frame.png"
              width={48}
              height={48}
              unoptimized={true}
              alt="Frame"
            />
            <button
              onClick={() => {
                HandleGoogle();
                notify();
              }}
              className="text-slate-400 text-[12px]"
            >
              Continue with Google
            </button>
          </div>
        </div>

        <ToastContainer
          position="top-center"
          limit={1}
          autoClose={1000}
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

export default SignIn;
