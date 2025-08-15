import React, { useState } from "react";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import AddApplication from "./AddApplication";

function QuickActions({ onJobAdded, onFilterChange, onSearchChange }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const statuses = [
    { key: "all", label: "All" },
    { key: "applied", label: "Applied" },
    { key: "pending", label: "Pending" },
    { key: "interviewing", label: "Interviewing" },
    { key: "rejected", label: "Rejected" },
  ];

  const handleSearchChange = (newQuery) => {
    setQuery(newQuery);
    if (onSearchChange) {
      onSearchChange(newQuery);
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (onFilterChange) {
      onFilterChange(newStatus);
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 6 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 420, damping: 34 },
    },
  };

  return (
    <>
      <div className="w-full bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)] p-4 flex flex-col gap-3">
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          variants={fadeUp}
          initial="initial"
          animate="animate"
        >
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7b8a92] transition-colors group-focus-within:text-[#193948]" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search applications, companies, roles"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/80 border border-white/60 outline-none focus:ring-2 focus:ring-[#FCDC73]/50 text-[#193948] placeholder:text-[#8aa0aa] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
            />
          </div>

          <motion.button
            type="button"
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ y: 0, scale: 0.99 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
              mass: 0.7,
            }}
            className="group relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[#193948]
                       bg-[linear-gradient(180deg,#FCDC73_0%,#f4d861_100%)]
                       shadow-[0_12px_28px_-16px_rgba(252,220,115,0.85)]
                       hover:brightness-[.98] active:brightness-95
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FCDC73]/60 cursor-pointer"
            onClick={() => setShowAddDialog(true)}
            aria-label="Add application"
          >
            <span className="pointer-events-none absolute inset-0">
              <span
                className="absolute -inset-y-6 -left-1/3 w-1/3 rotate-12 bg-white/40 blur-md opacity-0 transition-all duration-700
                               group-hover:opacity-60 group-hover:translate-x-[250%] group-active:opacity-40"
              />
            </span>
            <Plus className="h-5 w-5" />
            Add application
          </motion.button>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3"
          variants={fadeUp}
          initial="initial"
          animate="animate"
        >
          <div className="items-center gap-2 hidden sm:flex">
            <SlidersHorizontal className="h-4 w-4 text-[#193948]/70" />
            <span className="text-sm text-[#5b6d76]">Filter by status:</span>
          </div>

          <div className="relative flex items-center gap-1 overflow-x-auto sm:overflow-visible whitespace-nowrap sm:flex-wrap sm:whitespace-normal -mx-1 px-1 py-1">
            <div className="flex items-center gap-1 rounded-full border border-[#FCDC73]/30 bg-[#FCDC73]/20 p-1">
              {statuses.map((s) => {
                const active = status === s.key;
                return (
                  <motion.button
                    key={s.key}
                    onClick={() => handleStatusChange(s.key)}
                    aria-pressed={active}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all focus:outline-none
                                focus-visible:ring-2 focus-visible:ring-[#FCDC73]/50 cursor-pointer
                                ${
                                  active
                                    ? "bg-white/95 text-[#193948] border border-white/60 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.35)]"
                                    : "bg-transparent text-[#193948] border border-transparent hover:bg-white/60 hover:border-white/60"
                                }`}
                  >
                    {s.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
      <AddApplication
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onJobAdded={onJobAdded}
      />
    </>
  );
}

export default QuickActions;
