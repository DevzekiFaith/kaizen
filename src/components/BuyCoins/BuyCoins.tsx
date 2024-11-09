"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

const BuyCoins = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePaymentSuccess = () => {
    router.push("/content");
  };

  const handlePayment = () => {
    if (!isScriptLoaded || !window.PaystackPop) {
      console.error("Paystack script not loaded");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const config = {
        key: "pk_test_8dcf1e666d54aa2f0d2787f8930cef9f0202d226",
        email: "unovaconsultingfirstafrica@gmail.com",
        amount: 5000,
        callback: function (response: { reference: string }) {
          setIsLoading(false);
          alert("Payment complete! Reference: " + response.reference);
          handlePaymentSuccess();
        },
        onClose: function () {
          setIsLoading(false);
          alert("Payment closed.");
        },
      };

      const handler = window.PaystackPop.setup(config);
      handler.openIframe();
    }, 500);
  };

  return (
    <>
      <div className="w-80 p-6">
        <h1 className="text-2xl font-bold text-slate-400 mb-2">Buy Coins</h1>
        <p className="text-gray-400 text-sm mb-6">
          Purchase coins to continue journaling
        </p>

        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Pay with Paystack</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </>
          )}
        </button>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600 mb-4" />
            <p className="text-gray-700">Preparing your payment...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default BuyCoins;
