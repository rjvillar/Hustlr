import React, { useState, useEffect } from "react";
import { Badge } from "../components/ui/badge";
import {
  ListPlus,
  XCircle,
  MessageCircle,
  CheckCircle,
  Hourglass,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { getStats } from "@/api";

const getStatusConfig = (status) => {
  const statusMap = {
    applied: {
      label: "Applied",
      icon: ListPlus,
      classes: "bg-blue-100 text-blue-800",
    },
    interviewing: {
      label: "Interviewed",
      icon: MessageCircle,
      classes: "bg-yellow-100 text-yellow-800",
    },
    Accepted: {
      label: "Accepted",
      icon: CheckCircle,
      classes: "bg-green-100 text-green-800",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      classes: "bg-red-100 text-red-800",
    },
    withdrawn: {
      label: "Withdrawn",
      icon: XCircle,
      classes: "bg-gray-100 text-gray-800",
    },
  };

  return (
    statusMap[status] || {
      label: "Pending",
      icon: Hourglass,
      classes: "bg-gray-100 text-gray-800",
    }
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return `Added on ${date.toLocaleDateString("en-US", options)}`;
};

function RecentItems() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentItems = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const stats = await getStats(token);

        const recentItems =
          stats.recentApplications?.map((job) => ({
            title: job.title,
            company: job.company,
            location: job.location,
            date: formatDate(job.date),
            status: getStatusConfig(job.status),
          })) || [];

        setItems(recentItems);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch recent items:", error);
        setError(error.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentItems();
  }, [token]);

  if (loading) {
    return (
      <div className="divide-y divide-[#e9eef2]">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="py-2 animate-pulse">
            <div className="flex flex-col gap-0.5 sm:gap-1">
              <div className="flex items-start sm:items-center justify-between gap-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-red-600">
          Failed to load recent applications
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-[#5b6d76]">No recent applications yet</p>
        <p className="text-xs text-[#7b8a92] mt-1">
          Start adding job applications to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#e9eef2]">
      {items.map((item, idx) => {
        const Icon = item.status.icon;
        return (
          <div key={idx} className="py-2">
            <div className="flex flex-col gap-0.5 sm:gap-1">
              <div className="flex items-start sm:items-center justify-between gap-2">
                <p className="min-w-0 text-[15px] sm:text-base font-semibold text-[#193948] leading-tight truncate">
                  {item.title}
                </p>
                <Badge
                  className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs ${item.status.classes}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.status.label}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="min-w-0 text-[13px] sm:text-sm text-[#5b6d76] leading-snug truncate">
                  {item.company}{" "}
                  <span className="text-gray-500">· {item.location}</span>
                </p>
                <p className="shrink-0 text-[11px] sm:text-xs text-[#7b8a92]">
                  {item.date}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RecentItems;
