"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import Link from 'next/link';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

const plans: Record<string, SubscriptionPlan> = {
  pro: {
    id: 'pro_monthly',
    name: 'Pro Plan',
    price: 499,
    features: [
      'Advanced Analytics',
      '10 Journal Templates',
      'AI-Powered Insights',
      'Custom Templates',
      'Email Support',
      'Habit Tracking'
    ]
  },
  enterprise: {
    id: 'enterprise_monthly',
    name: 'Enterprise Plan',
    price: 1999,
    features: [
      'Everything in Pro',
      'Unlimited Templates',
      'Team Collaboration',
      'Advanced Export Options',
      'Custom Integrations',
      '24/7 Priority Support',
      'Team Analytics',
      'Custom Branding',
      'API Access'
    ]
  }
};

const SubscribePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [planType, setPlanType] = useState<string>('pro');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('plan')) {
      setPlanType(searchParams.get('plan')!);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // TODO: Integrate with a payment provider (Stripe/Razorpay)
      console.log('Processing subscription for plan:', plans[planType]);
      alert('Payment integration coming soon!');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to process subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Please sign in to subscribe</p>
          <Link 
            href="/signin"
            className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const selectedPlan = plans[planType];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Subscribe to {selectedPlan.name}
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Take your personal growth to the next level
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">{selectedPlan.name}</h2>
              <span className="text-3xl font-bold text-white">₹{selectedPlan.price}/mo</span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Features included:</h3>
                <ul className="space-y-3">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-orange-500 mr-3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">Billing Information</h3>
                <div className="bg-gray-900 p-4 rounded-md">
                  <p className="text-gray-300 text-sm">
                    You will be charged ₹{selectedPlan.price} (plus applicable taxes) monthly.
                    You can cancel your subscription at any time.
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Processing...' : 'Subscribe Now'}
              </button>

              <p className="text-sm text-gray-400 text-center mt-4">
                By subscribing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-300">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@reflectify.com" className="text-orange-500 hover:text-orange-400">
              support@reflectify.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;