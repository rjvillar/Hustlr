import React, { useState, useEffect } from "react";
import AnimatedNumber from "./AnimatedNumber";
import useAuth from "../hooks/useAuth";
import { getStats } from "../api";

function PendingCard() {
  const { token } = useAuth();
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const stats = await getStats(token);
        setPending(stats.pending || 0);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setPending(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="w-full sm:aspect-square md:aspect-auto bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-5 sm:p-4 md:p-5 flex flex-col items-start sm:justify-between text-[#193948] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)] transition-transform will-change-transform hover:-translate-y-0.5">
      <p className="text-[.8rem] leading-none">
        <span className="inline-block w-3 mr-1.5 mb-1">⌛</span>
        PENDINGS
      </p>
      <p className="font-bold leading-none text-[3rem] sm:text-5xl md:text-[4rem]">
        {loading ? (
          <span className="animate-pulse text-gray-400">--</span>
        ) : (
          <AnimatedNumber value={pending} />
        )}
      </p>
    </div>
  );
}

export default PendingCard;
