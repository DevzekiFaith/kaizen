"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getAuth } from 'firebase/auth';

interface PricingModalProps {
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ onClose }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [coins, setCoins] = useState(0);
  const [usedCoins, setUsedCoins] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUserCoins = async () => {
      if (user?.email) {
        const response = await fetch(`/api/coins/${user.email}`);
        const data = await response.json();
        setCoins(data.totalCoins);
        setUsedCoins(data.usedCoins);
      }
    };
    fetchUserCoins();
  }, [user]);

  const remainingCoins = coins - usedCoins;

  const useCoin = async () => {
    if (remainingCoins > 0) {
      try {
        const response = await fetch('/api/coins/use', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user?.email,
          }),
        });

        if (response.ok) {
          setUsedCoins(prev => prev + 1);
          toast.success('Coin used successfully!');
          onClose();
          router.push('/content');
        } else {
          throw new Error('Failed to use coin');
        }
      } catch (error: unknown) {
        toast.error('Failed to use coin. Please try again.');
      }
    } else {
      toast.error('No coins available!');
      const wantsToBuyMore = window.confirm(
        "You've used all your coins. Would you like to purchase more coins to continue journaling?"
      );
      
      if (wantsToBuyMore) {
        router.push('/buycoins');
      }
      onClose();
    }
  };

  return (    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Your Coin Balance</h2>
          
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="text-center">
              <span className="block text-3xl font-bold text-orange-500">{remainingCoins}</span>
              <span className="text-gray-400 text-sm">Available</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-gray-500">{usedCoins}</span>
              <span className="text-gray-400 text-sm">Used</span>
            </div>
          </div>
        </div>

        {remainingCoins > 0 ? (
          <button
            onClick={useCoin}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Use 1 Coin to Continue
          </button>
        ) : (
          <button
            onClick={() => router.push('/buycoins')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Buy More Coins
          </button>
        )}
      </div>
    </div>
  );
};

export default PricingModal;
