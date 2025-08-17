import React, { useState, useEffect } from "react";
import AnimatedNumber from "./AnimatedNumber";
import useAuth from "../hooks/useAuth";
import { getStats } from "../api";

function ApplicationCard() {
  const { token } = useAuth();
  const [totalApplications, setTotalApplications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        console.log("No token available for stats");
        setLoading(false);
        return;
      }

      try {
        console.log(
          "Fetching stats with token:",
          token ? "Token exists" : "No token"
        );
        const stats = await getStats(token);
        console.log("Received stats:", stats);
        console.log("Total applications from stats:", stats.totalApplications);
        setTotalApplications(stats.totalApplications || 0);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setError(error.message);
        setTotalApplications(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (error) {
    console.error("ApplicationCard error:", error);
  }

  return (
    <div className="w-full sm:aspect-square md:aspect-auto bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-5 sm:p-4 md:p-5 flex flex-col items-start sm:justify-between text-[#193948] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)] transition-transform will-change-transform hover:-translate-y-0.5">
      <p className="text-[.8rem] leading-none">
        <span className="inline-block w-3 mr-1.5 mb-1">📄</span>
        JOBS APPLIED
      </p>
      <p className="font-bold leading-none text-[3rem] sm:text-5xl md:text-[4rem]">
        {loading ? (
          <span className="animate-pulse text-gray-400">--</span>
        ) : error ? (
          <span className="text-red-400 text-sm">Error</span>
        ) : (
          <AnimatedNumber value={totalApplications} />
        )}
      </p>
      {error && (
        <p className="text-xs text-red-500 mt-1">Failed to load stats</p>
      )}
    </div>
  );
}

export default ApplicationCard;
