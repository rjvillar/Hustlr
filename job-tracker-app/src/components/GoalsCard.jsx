import React, { useEffect, useState } from "react";
import { Target, ArrowUpRight } from "lucide-react";

function useIsSmUp() {
  const [isSm, setIsSm] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 640px)").matches
      : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 640px)");
    const handler = (e) => setIsSm(e.matches);
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, []);
  return isSm;
}

function Ring({ progress = 72, size = 140, stroke = 12 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (progress / 100) * c;

  return (
    <svg width={size} height={size} className="block">
      <defs>
        <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34c759" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(25,57,72,0.08)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#ringGradient)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="46%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-[#193948] font-bold"
        style={{ fontSize: Math.round(size * 0.19) }}
      >
        {progress}%
      </text>
      <text
        x="50%"
        y="60%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-[#5b6d76]"
        style={{ fontSize: Math.round(size * 0.085) }}
      >
        of weekly goal
      </text>
    </svg>
  );
}

export default function GoalsCard() {
  const isSm = useIsSmUp();
  const ringSize = isSm ? 140 : 112;
  const ringStroke = isSm ? 12 : 10;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[#193948]">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-2xl bg-white/90 border border-white/60 shadow-sm grid place-items-center">
            <Target className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#1f6feb]" />
          </div>
          <h3 className="font-medium text-lg sm:text-xl">Weekly goal</h3>
        </div>
        <button className="text-xs sm:text-sm text-[#1f6feb] hover:underline inline-flex items-center gap-1">
          Edit goal <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>

      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="self-center sm:self-auto">
          <Ring progress={72} size={ringSize} stroke={ringStroke} />
        </div>

        <div className="flex-1 w-full">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="rounded-2xl bg-white/80 border border-white/60 p-2.5 sm:p-3">
              <p className="text-[11px] sm:text-xs text-[#5b6d76]">
                Applied this week
              </p>
              <p className="text-xl sm:text-2xl font-bold text-[#193948]">18</p>
            </div>
            <div className="rounded-2xl bg-white/80 border border-white/60 p-2.5 sm:p-3">
              <p className="text-[11px] sm:text-xs text-[#5b6d76]">
                Interviews
              </p>
              <p className="text-xl sm:text-2xl font-bold text-[#193948]">3</p>
            </div>
            <div className="rounded-2xl bg-white/80 border border-white/60 p-2.5 sm:p-3">
              <p className="text-[11px] sm:text-xs text-[#5b6d76]">Responses</p>
              <p className="text-xl sm:text-2xl font-bold text-[#193948]">9</p>
            </div>
            <div className="rounded-2xl bg-white/80 border border-white/60 p-2.5 sm:p-3">
              <p className="text-[11px] sm:text-xs text-[#5b6d76]">
                Avg. response time
              </p>
              <p className="text-xl sm:text-2xl font-bold text-[#193948]">
                2.3d
              </p>
            </div>
          </div>

          <button className="mt-3 sm:mt-4 w-full rounded-full px-4 py-2.5 bg-[#1f6feb] text-white hover:bg-[#1b60d6] active:bg-[#174fb3] transition-colors shadow-[0_10px_24px_-12px_rgba(31,111,235,0.65)]">
            Log application
          </button>
        </div>
      </div>
    </div>
  );
}
