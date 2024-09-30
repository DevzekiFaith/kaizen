"use client";

// import { UploadIcon } from '@radix-ui/react-icons'
import React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const router = useRouter();
  const HandleGoogle = async () => {
    const provider = await new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/signIn");
  };
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
  const [isSignIn, setIsSignIn] = useState(false); // State to toggle between Sign In and Sign Up

  const handleSignInClick = () => {
    setIsSignIn(true); // Set state to show Sign In component
  };

  return (
    <div>
      <div className="flex justify-center xl:flex-row flex-col items-center gap-[4rem] w-full p-[1rem]">
        <div>
          <Image
            className="w-[28rem] h-screen"
            src="/cover12.jpg"
            width={300}
            height={300}
            alt="login"
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
              {/* <button
              onClick={handleSignInClick}
              className="bg-transparent border-2 border-slate-600 p-[4px] rounded-2xl w-[7rem] text-slate-400 text-[16px]"
            >
              Sign In
            </button> */}
            </div>
            {isSignIn ? (
              <SignIn />
            ) : (
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
                      type="text"
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
                    <input
                      className="w-[24rem] h-[2.5rem] text-slate-300 bg-slate-800 rounded-3xl px-6 text-[12px]"
                      type="password"
                      placeholder="Create your password"
                      {...register("password", { required: true })}
                    />
                    {errors.password?.type === "required" && (
                      <p className="text-red-500" role="alert">
                        password is required
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
                    Sign Up
                  </button>
                </div>
                <div className=" ml-[3rem] mt-[1.5rem]">
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
            )}
          </div>
          <div className="flex justify-center items-center gap-[6px] bg-transparent border-2 border-white w-[24rem] h-[2.5rem] rounded-3xl mt-[1.2rem] ml-[3rem]">
            <Image src="/Frame.png" width={20} height={20} alt="origin" />
            <button
              onClick={HandleGoogle}
              type="submit"
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

export default SignUp;
