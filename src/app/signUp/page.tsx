"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  browserPopupRedirectResolver,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cover12 from "../../../Public/images/cover12.jpg";
import Frame from "../../../Public/images/Frame.png";

async function addDataToFireStore(name: string, email: string) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name,
      email,
      createdAt: new Date().toISOString(),
    });
    console.log("Document written with ID: ", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
    return false;
  }
}

type FormValues = {
  name: string;
  email: string;
  password: string;
};

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      console.log("Starting Google sign-in process...");

      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      provider.setCustomParameters({
        prompt: 'select_account',
        login_hint: 'user@example.com'
      });

      console.log("Initialized Google provider with scopes");

      try {
        console.log("Proceeding with signInWithPopup...");
        const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
        
        console.log("Sign-in successful:", result.user.email);

        if (!result.user) throw new Error('No user data returned');

        const success = await addDataToFireStore(
          result.user.displayName || 'Unknown',
          result.user.email || 'No email'
        );

        if (success) {
          toast.success('Successfully signed up with Google!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });
          setTimeout(() => {
            router.push('/signIn');
          }, 1000);
        } else {
          throw new Error('Failed to create user profile');
        }
      } catch (popupError) {
        console.error('Popup error:', popupError);
        if (popupError instanceof FirebaseError) {
          if (popupError.code === 'auth/popup-blocked') {
            toast.error('Popup was blocked. Please allow popups for this website and try again.');
          } else if (popupError.code === 'auth/internal-error') {
            toast.error('Authentication error. Please try again or use a different browser.');
          } else {
            throw popupError;
          }
        } else {
          throw popupError;
        }
      }
    } catch (error) {
      console.error('Detailed Google sign-in error:', error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            toast.info('Sign-in cancelled by user');
            break;
          case 'auth/popup-blocked':
            toast.error('Popup was blocked. Please allow popups for this website');
            break;
          case 'auth/cancelled-popup-request':
            toast.info('Previous sign-in operation in progress');
            break;
          case 'auth/network-request-failed':
            toast.error('Network error. Please check your internet connection');
            break;
          default:
            toast.error(`Authentication error: ${error.code}`);
        }
      } else {
        toast.error('Failed to sign in with Google. Please try again.');
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
      await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const success = await addDataToFireStore(data.name, data.email);
      if (success) {
        toast.success('Account created successfully!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        reset();
        setTimeout(() => {
          router.push('/signIn');
        }, 1000);
      } else {
        throw new Error('Failed to create user profile');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            toast.error('An account with this email already exists');
            break;
          case 'auth/invalid-email':
            toast.error('Please enter a valid email address');
            break;
          case 'auth/weak-password':
            toast.error('Password should be at least 6 characters');
            break;
          default:
            toast.error(error.message);
        }
      } else {
        toast.error('An error occurred during sign up');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in:', user.email);
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
            priority
          />
        </div>
        <div className="mt-[5rem]">
          <div className="mb-[2rem]">
            <h1 className="text-orange-500 uppercase font-bold text-[22px] w-[26rem] ml-[3rem]">
              Reflectify
            </h1>
          </div>
          <div>
            <div className="flex justify-between items-align w-[26rem]">
              <h5 className="text-slate-700 text-[16px] w-[26rem] ml-[3rem] pt-[4px] mb-[-2rem]">
                Create your Account
              </h5>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-[26rem] p-[2.8rem]">
              <div className="flex flex-col">
                <span className="flex flex-col">
                  <label className="text-slate-200 mb-[.9rem] mt-[.9rem]">
                    Name
                  </label>
                  <input
                    className="w-[24rem] h-[2.5rem] text-slate-300 bg-slate-800 rounded-3xl px-6 text-[12px] mb-1"
                    type="text"
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
                    className="w-[24rem] h-[2.5rem] text-slate-300 bg-slate-800 rounded-3xl px-6 text-[12px]"
                    type="email"
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
                      placeholder="Create your password"
                      {...register("password", { required: true })}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-2 top-2 text-slate-300"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
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
                  className="bg-orange-600 w-[24rem] h-[2.5rem] mt-[1.2rem] rounded-3xl text-slate-300 font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </button>
              </div>
              <div className="ml-[3rem] mt-[1.5rem]">
                <h6 className="text-slate-600 text-center text-[12px]">
                  Already have an account?{" "}
                  <Link href="/signIn" className="text-green-500 hover:text-green-400 transition-colors">
                    Sign In
                  </Link>
                </h6>
              </div>
              <div className="flex justify-center items-center mt-[1.5rem] ml-[3rem]">
                <hr className="bg-slate-400 w-[6rem] mt-[9px] mr-3" />
                <span className="text-slate-400">OR</span>
                <hr className="bg-slate-400 w-[6rem] mt-[9px] ml-3" />
              </div>
            </form>
            <div className="flex justify-center items-center">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex items-center gap-2 bg-transparent border-2 border-white hover:border-slate-300 w-[24rem] h-[2.5rem] rounded-3xl text-slate-400 hover:text-slate-300 transition-all duration-200 justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white disabled:hover:text-slate-400"
              >
                <Image
                  src={Frame}
                  width={20}
                  height={20}
                  alt="Google"
                  className="w-[20px] h-[20px]"
                  priority
                />
                {isLoading ? "Connecting..." : "Continue with Google"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={1}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
