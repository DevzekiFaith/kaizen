"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  User,
  browserPopupRedirectResolver,
  browserLocalPersistence,
  setPersistence 
} from "firebase/auth";
import {
  // getAuth, // Removed unused import
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import Cover10 from "../../../Public/images/cover10.jpg"
import Framer from "../../../Public/images/Frame.png"
import { FirebaseError } from "firebase/app";

type FormValues = {
  email: string;
  password: string;
};

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const setupAuth = async () => {
      await setPersistence(auth, browserLocalPersistence);
    };
    setupAuth();
  }, []);

  const showWelcomeBack = (user: User) => {
    const name = user.displayName || user.email?.split('@')[0] || 'User';
    toast.success(`Welcome back!, ${name}! 👋`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      transition: Zoom,
    });
  };

  const HandleGoogle = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      console.log("Starting Google sign-in process...");

      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      console.log("Initialized Google provider with scopes");

      const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      console.log("Sign-in successful:", result.user.email);
      
      // Store the user info immediately after successful sign-in
      if (result.user) {
        localStorage.setItem('userDisplayName', result.user.displayName || '');
        localStorage.setItem('userPhotoURL', result.user.photoURL || '');
        localStorage.setItem('userEmail', result.user.email || '');
      }
      
      showWelcomeBack(result.user);
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Detailed Google sign-in error:", error);
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            toast.info('Sign-in cancelled. Please try again');
            break;
          case 'auth/popup-blocked':
            toast.error('Popup was blocked. Please allow popups for this website and try again');
            break;
          case 'auth/cancelled-popup-request':
            toast.info('Previous sign-in still in progress');
            break;
          case 'auth/network-request-failed':
            toast.error('Network error. Please check your internet connection');
            break;
          default:
            toast.error(`Authentication error: ${error.code}`);
        }
      } else {
        toast.error('Failed to sign in with Google. Please try again later.');
      }
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
    if (isLoading) return;

    try {
      setIsLoading(true);
      const { email, password } = data;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Store user info
      if (userCredential.user) {
        localStorage.setItem('userDisplayName', userCredential.user.displayName || '');
        localStorage.setItem('userPhotoURL', userCredential.user.photoURL || '');
        localStorage.setItem('userEmail', userCredential.user.email || '');
      }
      
      reset();
      showWelcomeBack(userCredential.user);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Error signing in:", error);
      let errorMessage = "Failed to sign in. Please check your credentials.";
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Update localStorage whenever auth state changes
        localStorage.setItem('userDisplayName', user.displayName || '');
        localStorage.setItem('userPhotoURL', user.photoURL || '');
        localStorage.setItem('userEmail', user.email || '');
        console.log('User is signed in:', user.email);
      } else {
        // Clear localStorage when user signs out
        localStorage.removeItem('userDisplayName');
        localStorage.removeItem('userPhotoURL');
        localStorage.removeItem('userEmail');
        console.log('No user signed in');
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
            src={Cover10}
            width={300}
            height={300}
            alt="Cover"
            priority
          />
        </div>
        <div>
          <div className="mb-[2rem]">
            <h1 className="text-orange-500 uppercase font-bold text-[22px] w-[26rem] ml-[3rem] animate-pulse">
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
                    className="w-[24rem] h-[2.5rem] text-slate-500 bg-slate-800 rounded-3xl px-6 text-[12px]"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", { 
                      required: true,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500" role="alert">
                      {errors.email.type === "required" 
                        ? "Email is required" 
                        : errors.email.message}
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
                      placeholder="Enter your password"
                      {...register("password", { 
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        }
                      })}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute top-2 right-4"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-6 w-6 text-slate-400" />
                      ) : (
                        <Eye className="h-6 w-6 text-slate-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500" role="alert">
                      {errors.password.message}
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
                  className="bg-orange-600 w-[24rem] h-[2.5rem] mt-[1.2rem] rounded-3xl text-slate-300 font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
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

              <div className="mt-[1.5rem]">
                <h6 className="text-slate-600 text-center ml-[3rem] text-[12px]">
                  Do not have an account?{" "}
                  <Link href="/signUp">
                    <span className="cursor-pointer text-green-500 hover:text-green-400">
                      Sign Up
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
          <div className="flex justify-center items-center">
            <button
              onClick={HandleGoogle}
              disabled={isLoading}
              className="flex items-center gap-2 bg-transparent border-2 border-white hover:border-slate-300 w-[24rem] h-[2.5rem] rounded-3xl text-slate-400 hover:text-slate-300 transition-all duration-200 justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white disabled:hover:text-slate-400"
            >
              <Image
                className="h-5 w-5"
                src={Framer}
                width={20}
                height={20}
                alt="Google"
                priority
              />
              {isLoading ? "Connecting..." : "Continue with Google"}
            </button>
          </div>
        </div>

        <ToastContainer
          position="top-center"
          limit={1}
          autoClose={2000}
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
