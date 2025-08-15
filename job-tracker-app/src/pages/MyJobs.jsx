import React, { useRef, useState } from "react";
import QuickActions from "@/components/QuickActions";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";
import JobItems from "@/components/JobItems";

function MyJobs() {
  const jobItemsRef = useRef();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleJobAdded = (newJob) => {
    if (jobItemsRef.current) {
      jobItemsRef.current.addJob(newJob);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSearchChange = (newQuery) => {
    setSearchQuery(newQuery);
  };

  return (
    <div className="h-full min-h-[calc(100vh-120px)] bg-[#f7f6fb] overflow-hidden px-2 sm:px-20">
      <div className="py-5 text-[#193948]">
        <h1 className="font-black text-2xl px-5 sm:text-3xl">
          Your job list, all here{" "}
          <EmojiProvider data={emojiData}>
            <Emoji name="rocket" className="inline-block w-7 ml-1 mb-2" />
          </EmojiProvider>
        </h1>
        <div className="px-5 pt-3 sm:p-5">
          <QuickActions
            onJobAdded={handleJobAdded}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
          />
        </div>
        <div>
          <JobItems
            ref={jobItemsRef}
            filter={filter}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
}

export default MyJobs;
