import React, { useMemo, useState, useEffect } from "react";
import { PieChart } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { getStats } from "../api";

export default function StatusBreakdown() {
  const { token } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const stats = await getStats(token);
        setStatsData(stats);
      } catch (error) {
        console.error("Failed to fetch stats for StatusBreakdown:", error);
        setStatsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const data = useMemo(() => {
    if (!statsData || !statsData.statusBreakdown) {
      return [
        { label: "Applied", value: 0, color: "#1f6feb" },
        { label: "Pending", value: 0, color: "#0ea5e9" },
        { label: "Interviews", value: 0, color: "#f59e0b" },
        { label: "Rejections", value: 0, color: "#ef4444" },
      ];
    }

    return [
      {
        label: "Applied",
        value: statsData.statusBreakdown.applied || 0,
        color: "#1f6feb",
      },
      {
        label: "Interviewing",
        value: statsData.statusBreakdown.interviewing || 0,
        color: "#f59e0b",
      },
      {
        label: "Accepted",
        value: statsData.statusBreakdown["accepted"] || 0,
        color: "#22c55e",
      },
      {
        label: "Rejections",
        value: statsData.statusBreakdown.rejected || 0,
        color: "#ef4444",
      },
      {
        label: "Withdrawn",
        value: statsData.statusBreakdown.withdrawn || 0,
        color: "#6b7280",
      },
    ].filter((item) => item.value > 0);
  }, [statsData]);

  const { total, gradient } = useMemo(() => {
    const total = data.reduce((a, b) => a + b.value, 0);

    if (total === 0) {
      return {
        total: 0,
        gradient: "conic-gradient(#e5e7eb 0deg 360deg)",
      };
    }

    let acc = 0;
    const slices = data.map((d) => {
      const start = (acc / total) * 360;
      acc += d.value;
      const end = (acc / total) * 360;
      return `${d.color} ${start}deg ${end}deg`;
    });
    return { total, gradient: `conic-gradient(${slices.join(", ")})` };
  }, [data]);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)] p-5">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="grid grid-cols-[2.25rem_1fr] items-center gap-x-2 sm:flex sm:items-center sm:gap-2 text-[#193948]">
            <div className="h-9 w-9 rounded-2xl bg-white/90 border border-white/60 shadow-sm grid place-items-center col-start-1 row-span-2 sm:row-span-1">
              <PieChart className="h-5 w-5 text-[#1f6feb]" />
            </div>
            <h3 className="col-start-2 font-medium text-lg sm:text-xl leading-none sm:leading-tight">
              Status breakdown
            </h3>
            <span className="col-start-2 mt-0.5 text-xs text-[#5b6d76] sm:hidden">
              All time
            </span>
          </div>

          <span className="hidden sm:inline text-sm text-[#5b6d76]">
            All time
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
          <div className="relative h-44 w-44 mx-auto rounded-full bg-gray-200 animate-pulse">
            <div className="absolute inset-4 rounded-full bg-white/90 backdrop-blur-xl border border-white/60" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-xs text-[#5b6d76]">Total</p>
                <p className="text-3xl font-bold text-[#193948]">--</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-gray-200" />
                  <span className="h-4 w-16 bg-gray-200 rounded"></span>
                </div>
                <div className="h-4 w-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)] p-5">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="grid grid-cols-[2.25rem_1fr] items-center gap-x-2 sm:flex sm:items-center sm:gap-2 text-[#193948]">
          <div className="h-9 w-9 rounded-2xl bg-white/90 border border-white/60 shadow-sm grid place-items-center col-start-1 row-span-2 sm:row-span-1">
            <PieChart className="h-5 w-5 text-[#1f6feb]" />
          </div>
          <h3 className="col-start-2 font-medium text-lg sm:text-xl leading-none sm:leading-tight">
            Status breakdown
          </h3>
          <span className="col-start-2 mt-0.5 text-xs text-[#5b6d76] sm:hidden">
            All time
          </span>
        </div>

        <span className="hidden sm:inline text-sm text-[#5b6d76]">
          All time
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
        <div
          className="relative h-44 w-44 mx-auto rounded-full"
          style={{ background: gradient }}
        >
          <div className="absolute inset-4 rounded-full bg-white/90 backdrop-blur-xl border border-white/60" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-xs text-[#5b6d76]">Total</p>
              <p className="text-3xl font-bold text-[#193948]">{total}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {data.length > 0 ? (
            data.map((d) => (
              <div key={d.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-[#193948]">{d.label}</span>
                </div>
                <div className="text-[#193948] font-medium">{d.value}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-[#5b6d76]">No applications yet</p>
              <p className="text-xs text-[#7b8a92] mt-1">
                Start adding job applications to see breakdown
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
