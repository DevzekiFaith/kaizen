"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaArrowCircleRight } from "react-icons/fa";
import Welcome from "../Welcome-Page/Welcome";
import Content from "../Content/Content";
import Reflectifly from "../about-app/Reflectifly";

const SplashScreen: React.FC = () => {
    // Holds the current step of the component being displayed
    const [currentStep, setCurrentStep] = useState(1);
    // Total number of components (steps) in the app
    const totalSteps = 3;

    // Navigate to the next step, ensuring the last step is not exceeded
    const goToNextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const renderCurrentComponent = () => {
        switch (currentStep) {
            case 1:
                return <Welcome />;
            case 2:
                return <Content />;
            case 3:
                return <Reflectifly />;
            // default:
            //     return null; // Handle default case
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            {/* {renderCurrentComponent()} */}
            <div className="p-[6px] mb-[1rem] w-[300px]">
                <h6 className="text-slate-700 absolute top-[10rem] z-50 w-[200px] text-[14px]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus commodi
                    rem eum! Delectus totam cumque eligendi voluptatibus ut doloremque
                </h6>
                <h6 className="text-slate-400 absolute top-[35rem] z-50 w-[200px] text-[14px]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus commodi
                </h6>
            </div>
            <div>
                <Image
                    className="relative rounded-3xl"
                    src="/cover2.jpg"
                    width={300}
                    height={600}
                    alt="Welcome Screen"
                />
            </div>
            <div className="bg-[#222d30] bg-transparent p-[12px] w-[18rem] rounded-2xl cursor-pointer flex justify-end items-center gap-[12px] mt-[1.2rem] border border-slate-600 absolute">
                <button
                    onClick={goToNextStep}
                    className="text-slate-200 font-bold text-[14px]"
                >
                    Next
                </button>
                <FaArrowCircleRight className="text-slate-200 text-[18px] hover:translate-x-0.5 cursor-pointer" />
            </div>
        </div>
    );
};

export default SplashScreen;
