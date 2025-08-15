import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  Phone,
  Briefcase,
  AtSign,
  Check,
} from "lucide-react";

const initialTasks = [
  {
    id: 1,
    title: "Follow up email",
    company: "Google Inc.",
    due: "Tomorrow",
    icon: AtSign,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    title: "Technical interview",
    company: "Microsoft",
    due: "Mon, 10:00 AM",
    icon: Phone,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 3,
    title: "Complete assessment",
    company: "Spotify Inc.",
    due: "Tue, 5:00 PM",
    icon: Briefcase,
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: 4,
    title: "Update resume",
    company: "Portfolio",
    due: "Fri, 3:00 PM",
    icon: CalendarDays,
    color: "bg-green-100 text-green-800",
  },
];

export default function UpcomingTasks() {
  const tasks = initialTasks;
  const [done, setDone] = useState({});
  const toggle = (id) => setDone((d) => ({ ...d, [id]: !d[id] }));

  const Checkbox = ({ checked, onChange, label }) => (
    <label
      title={label}
      className="group relative inline-flex items-center cursor-pointer select-none"
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={label}
        className="peer sr-only"
      />
      <span
        className={`grid place-items-center h-8 w-8 sm:h-7 sm:w-7 rounded-xl border bg-white shadow-[0_8px_20px_-14px_rgba(0,0,0,0.35)] transition-all
          border-[#d6dee6]
          group-hover:border-[#c8d1da]
          peer-focus-visible:ring-2 peer-focus-visible:ring-[#1f6feb]/30
          peer-checked:bg-[#34c759] peer-checked:border-[#34c759] peer-checked:shadow-[0_10px_26px_-14px_rgba(52,199,89,0.75)]`}
      >
        <Check
          className="h-4.5 w-4.5 sm:h-4 sm:w-4 text-white opacity-0 scale-90 transition-all duration-150
            peer-checked:opacity-100 peer-checked:scale-100"
          strokeWidth={3}
        />
      </span>
      <span className="sr-only">Done</span>
    </label>
  );

  return (
    <div className="divide-y divide-[#e9eef2]">
      {tasks.map((t) => {
        const Icon = t.icon;
        const isDone = !!done[t.id];
        return (
          <div
            key={t.id}
            className="flex items-start sm:items-center justify-between gap-2 sm:gap-3 py-2 sm:py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="sm:hidden">
                <Checkbox
                  checked={isDone}
                  onChange={() => toggle(t.id)}
                  label={isDone ? "Mark as not done" : "Mark as done"}
                />
              </div>
              <div className="hidden sm:grid h-10 w-10 rounded-2xl bg-white/90 border border-white/60 shadow-sm place-items-center shrink-0">
                <Icon className="h-5 w-5 text-[#1f6feb]" />
              </div>

              <div className="flex flex-col min-w-0">
                <p
                  className={`font-semibold text-[#193948] leading-tight text-[15px] sm:text-base truncate ${
                    isDone ? "line-through opacity-60" : ""
                  }`}
                  title={t.title}
                >
                  {t.title}
                </p>
                <p
                  className={`text-xs sm:text-sm text-[#5b6d76] leading-snug truncate ${
                    isDone ? "line-through opacity-60" : ""
                  }`}
                  title={t.company}
                >
                  {t.company}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 sm:gap-3">
              <span
                className={`text-[11px] sm:text-xs px-2 py-0.5 sm:px-2 sm:py-1 rounded-full ${t.color}`}
              >
                <Clock className="inline-block h-3.5 w-3.5 mr-1 align-[-2px]" />
                {t.due}
              </span>

              <div className="hidden sm:block">
                <Checkbox
                  checked={isDone}
                  onChange={() => toggle(t.id)}
                  label={isDone ? "Mark as not done" : "Mark as done"}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
