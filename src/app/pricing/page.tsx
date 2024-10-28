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

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "₹0",
    description: "Perfect for getting started with basic journaling",
    features: [
      { text: "Basic Daily Journal", available: true },
      { text: "Simple Task Tracking", available: true },
      { text: "Basic Analytics", available: true },
      { text: "Community Access", available: true },
      { text: "2 Journal Templates", available: true },
      { text: "Advanced Analytics", available: false },
      { text: "AI Insights", available: false },
      { text: "Custom Templates", available: false },
      { text: "Priority Support", available: false },
    ],
    buttonText: "Get Started",
    href: "/signUp"
  },
  {
    name: "Pro",
    price: "₹499/mo",
    description: "Enhanced features for serious self-improvement",
    features: [
      { text: "Everything in Free", available: true },
      { text: "Advanced Analytics", available: true },
      { text: "10 Journal Templates", available: true },
      { text: "AI-Powered Insights", available: true },
      { text: "Custom Templates", available: true },
      { text: "Email Support", available: true },
      { text: "Habit Tracking", available: true },
      { text: "Export Options", available: false },
      { text: "Team Features", available: false },
    ],
    buttonText: "Subscribe Now",
    href: "/subscribe?plan=pro",
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "₹1999/mo",
    description: "Complete solution for teams and organizations",
    features: [
      { text: "Everything in Pro", available: true },
      { text: "Unlimited Templates", available: true },
      { text: "Team Collaboration", available: true },
      { text: "Advanced Export Options", available: true },
      { text: "Custom Integrations", available: true },
      { text: "24/7 Priority Support", available: true },
      { text: "Team Analytics", available: true },
      { text: "Custom Branding", available: true },
      { text: "API Access", available: true },
    ],
    buttonText: "Contact Sales",
    href: "/contact"
  }
];
const PricingPage = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Choose Your Path to Growth
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Select the plan that best fits your journey of self-improvement
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-1 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg shadow-lg divide-y divide-gray-700 ${
                plan.highlighted
                  ? 'border-2 border-orange-500 bg-gray-900'
                  : 'border border-gray-700 bg-gray-800'
              }`}
            >
              <div className="p-6">
                <h3 className="text-2xl font-semibold leading-6 text-white">
                  {plan.name}
                </h3>
                <p className="mt-4 text-sm text-gray-300">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-white">
                    {plan.price}
                  </span>
                  {plan.price !== "₹0" && (
                    <span className="text-base font-medium text-gray-300">
                      {" "}/month
                    </span>
                  )}
                </p>
                <Link
                  href={plan.href}
                  className={`mt-8 block w-full bg-orange-600 hover:bg-orange-700 py-2 px-4 rounded-md text-white text-center font-medium ${
                    plan.highlighted
                      ? 'hover:bg-orange-700'
                      : 'hover:bg-orange-600'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-white tracking-wide uppercase">
                  What is included
                </h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, featureIdx) => (
                    <li
                      key={featureIdx}
                      className="flex space-x-3 items-center"
                    >
                      <Check
                        className={`h-5 w-5 ${
                          feature.available ? 'text-orange-500' : 'text-gray-500'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          feature.available ? 'text-white' : 'text-gray-500'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-300">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            Need help choosing? {" "}
            <Link href="/contact" className="text-orange-500 hover:text-orange-400">
              Contact our team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;