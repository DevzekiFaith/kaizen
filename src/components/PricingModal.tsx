import router from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

interface CoinResponse {
  availableCoins: number;
  usedCoins: number;
}

export const PricingModal = () => {
  const [loading, setLoading] = useState(false);
  const [availableCoins, setAvailableCoins] = useState(0);
  const [usedCoins, setUsedCoins] = useState(0); // Ensure usedCoins state is declared here

  const fetchCoinData = async (): Promise<CoinResponse> => {
    const response = await fetch("/api/coins/use", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to use coin");
    }

    return response.json();
  };

  const handleUseCoin = async () => {
    if (availableCoins > 0) {
      setLoading(true);
      try {
        const data = await fetchCoinData(); // Call renamed function

        setAvailableCoins(data.availableCoins);
        setUsedCoins(data.usedCoins); // Update the usedCoins state

        toast.success("Coin used successfully!");
        router.push("/content");
      } catch (error) {
        toast.error("Failed to use coin. Please try again.");
        console.error("Error using coin:", error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("No coins available!");
      const wantsToBuyMore = window.confirm(
        "You've used all your coins. Would you like to purchase more coins to continue journaling?"
      );

      if (wantsToBuyMore) {
        router.push("/buycoins");
      }
    }
  };

  return (
    <div>
      <button onClick={handleUseCoin} disabled={loading}>
        {loading ? "Processing..." : "Use Coin"}
      </button>
      <div>Available Coins: {availableCoins}</div>
      <div>Used Coins: {usedCoins}</div> {/* Display usedCoins if relevant */}
    </div>
  );
};

export default PricingModal;
