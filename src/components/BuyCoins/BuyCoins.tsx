"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { LuCoins } from "react-icons/lu";

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

interface Coin {
  id: number;
  name: string;
  price: number;
  coinCount: number;
}

const BuyCoins: React.FC = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [freeCoinUsage, setFreeCoinUsage] = useState(2);
  const router = useRouter();

  const coins: Coin[] = [
    { id: 0, name: "Free Coin", price: 0, coinCount: 2 },
    { id: 1, name: "Gold Coin", price: 5000, coinCount: 5 },
    { id: 2, name: "Silver Coin", price: 3000, coinCount: 3 },
    { id: 3, name: "Bronze Coin", price: 2000, coinCount: 1 },
    { id: 4, name: "Platinum Coin", price: 7000, coinCount: 7 },
    { id: 5, name: "Diamond Coin", price: 10000, coinCount: 10 },
  ];

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

  const handleFreeAccess = () => {
    if (freeCoinUsage > 0) {
      setFreeCoinUsage(freeCoinUsage - 1);
      router.push("/content");
    } else {
      alert("Free coin limit reached. Please buy more coins to access content.");
    }
  };

  const handlePayment = () => {
    if (!isScriptLoaded || !window.PaystackPop || !selectedCoin) {
      console.error("Payment cannot proceed. Check Paystack script or selection.");
      return;
    }

    setIsLoading(true);

    const config = {
      key: "pk_test_8dcf1e666d54aa2f0d2787f8930cef9f0202d226",
      email: "unovaconsultingfirstafrica@gmail.com",
      amount: selectedCoin.price * 100,
      callback: (response: { reference: string }) => {
        setIsLoading(false);
        alert("Payment complete! Reference: " + response.reference);
        handlePaymentSuccess();
      },
      onClose: () => {
        setIsLoading(false);
        alert("Payment closed.");
      },
    };

    const handler = window.PaystackPop?.setup(config);
    handler?.openIframe();
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Buy Coins</h1>
      <p className="text-gray-600 text-sm mb-4">
        Choose a coin package to proceed with payment
      </p>

      <div className="grid grid-cols-2 gap-4 w-full">
        {coins.map((coin) => (
          <div
            key={coin.id}
            onClick={() => setSelectedCoin(coin)}
            className={`p-4 bg-white rounded-lg shadow-md flex flex-col items-center text-center cursor-pointer transition-transform transform hover:scale-105 ${
              selectedCoin?.id === coin.id ? "border-2 border-orange-600" : ""
            }`}
          >
            <LuCoins className="text-yellow-500 w-16 h-16 mb-2" />
            <h2 className="text-lg font-semibold text-slate-800">{coin.name}</h2>
            <p className="text-gray-500">{coin.coinCount} Coins</p>
            {coin.price > 0 ? (
              <p className="text-gray-500">${(coin.price / 100).toFixed(2)}</p>
            ) : (
              <p className="text-green-500 font-semibold">Free</p>
            )}
          </div>
        ))}
      </div>

      {selectedCoin?.id === 0 && freeCoinUsage > 0 ? (
        <button
          onClick={handleFreeAccess}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 mt-4"
        >
          Access Content (Free Coins Left: {freeCoinUsage})
        </button>
      ) : (
        <button
          onClick={handlePayment}
          disabled={isLoading || !selectedCoin}
          className={`w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 mt-4 ${
            !selectedCoin && "opacity-50 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <span>Pay with Paystack</span>
          )}
        </button>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600 mb-4" />
            <p className="text-gray-700">Preparing your payment...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyCoins;
