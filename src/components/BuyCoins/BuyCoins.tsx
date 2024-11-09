"use client"


import React, { useEffect, useState } from 'react';

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
  }}

const BuyCoins = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load the Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true); // Set state when script is loaded
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!isScriptLoaded || !window.PaystackPop) {
      console.error("Paystack script not loaded");
      return;
    }

    // Setup the payment handler with required options
    const handler = window.PaystackPop.setup({
      key: 'pk_test_8dcf1e666d54aa2f0d2787f8930cef9f0202d226', // Replace with your Paystack public key
      email: 'unovaconsultingfirstafrica@gmail.com', // User's email
      amount: 5000, // Amount in kobo (multiply naira by 100)
      callback: function (response: { reference: string }) {
        // Handle success
        alert('Payment complete! Reference: ' + response.reference);
      },      onClose: function () {
        // Handle when the user closes the payment modal
        alert('Payment closed.');
      },
    });

    handler.openIframe(); // Open the Paystack payment modal
  };

  return (
    <div className="w-80 p-6">
      <h1 className="text-2xl font-bold text-slate-400 mb-2">Buy Coins</h1>
      <p className="text-gray-400 text-sm mb-6">Purchase coins to unlock premium features</p>
      
      <button 
        onClick={handlePayment}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <span>Pay with Paystack</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  );
  
};

export default BuyCoins;
