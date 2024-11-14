'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface PricingModalProps {
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ onClose }) => {
  const [availableCoins, setAvailableCoins] = useState<number>(0);
  const [usedCoins, setUsedCoins] = useState<number>(0);
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser.email);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserCoins = async () => {
      if (user) {
        try {
          const response = await fetch('/api/coins/balance', {
            credentials: 'include',
          });

          if (!response.ok) throw new Error('Failed to fetch coins');

          const data = await response.json();
          setAvailableCoins(data.availableCoins);
          setUsedCoins(data.usedCoins);
        } catch (error) {
          toast.error('Failed to load coin balance');
          console.error('Error fetching coins:', error);
        }
      }
    };

    fetchUserCoins();
  }, [user]);

  const useCoin = async () => {
    if (availableCoins > 0) {
      try {
        const response = await fetch('/api/coins/use', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to use coin');

        const data = await response.json();
        setAvailableCoins(data.availableCoins);
        setUsedCoins(data.usedCoins);

        toast.success('Coin used successfully!');
        onClose();
        router.push('/content');
      } catch (error) {
        toast.error('Failed to use coin. Please try again.');
        console.error('Error using coin:', error);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center transition-all duration-300 ease-in-out">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full mx-4 transform transition-transform duration-300 ease-in-out scale-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
        >
          ✕
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-white">Your Coin Balance</h2>
        </div>

        <div className="flex justify-center items-center space-x-8 mb-6">
          <div className="text-center">
            <span className="block text-4xl font-bold text-green-400">{availableCoins}</span>
            <span className="text-gray-400 text-sm">Available</span>
          </div>
          <div className="text-center">
            <span className="block text-4xl font-bold text-red-400">{usedCoins}</span>
            <span className="text-gray-400 text-sm">Used</span>
          </div>
        </div>

        {availableCoins > 0 ? (
          <button
            onClick={useCoin}
            className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-none"
          >
            Use 1 Coin to Continue
          </button>
        ) : (
          <button
            onClick={() => router.push('/buycoins')}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-none"
          >
            Buy More Coins
          </button>
        )}
      </div>
    </div>
  );
};

export default PricingModal;
