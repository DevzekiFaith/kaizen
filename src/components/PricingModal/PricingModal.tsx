"use client";

import React from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

interface PlanFeature {
  text: string;
  available: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  href: string;
  highlighted?: boolean;
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started with basic journaling",
    features: [
      { text: "Basic Daily Journal", available: true },
      { text: "Simple Task Tracking", available: true },
      { text: "Basic Analytics", available: true },
      { text: "Community Access", available: true },
    ],
    buttonText: "Current Plan",
    href: "#"
  },
  {
    name: "Pro",
    price: "$4",
    description: "Enhanced features for serious self-improvement",
    features: [
      { text: "Everything in Free", available: true },
      { text: "Advanced Analytics", available: true },
      { text: "AI-Powered Insights", available: true },
      { text: "Custom Templates", available: true },
    ],
    buttonText: "Upgrade Now",
    href: "/subscribe?plan=pro",
    highlighted: true
  }
];

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center pt-[5.5rem]">
      <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Upgrade Your Experience</h2>
          <p className="text-gray-400">Choose the plan that best fits your journey</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg p-6 ${
                plan.highlighted
                  ? 'border-2 border-orange-500 bg-gray-800'
                  : 'border border-gray-700 bg-gray-800'
              }`}
            >
              <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-4">{plan.description}</p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                {plan.price !== "₹0" && (
                  <span className="text-gray-400">/month</span>
                )}
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-orange-500 mr-2" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full text-center py-2 px-4 rounded-md font-medium
                  ${plan.highlighted
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-gray-700 text-gray-300 cursor-not-allowed'
                  }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>All plans include a 14-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;