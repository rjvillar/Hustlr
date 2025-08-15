import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  MapPin,
  StickyNote,
  Building2,
  Home,
  Laptop,
  ListPlus,
  XCircle,
  MessageCircle,
  CheckCircle,
  Hourglass,
  Trash2,
  Edit,
} from "lucide-react";
import { X as CloseIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";
import JobDetailsDialog from "./JobDetailsDialog";
import EditDialog from "./EditDialog";
import useAuth from "../hooks/useAuth";
import { getJobs, deleteJob } from "../api";

const JobItems = forwardRef(({ filter, searchQuery }, ref) => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await getJobs(token);
        console.log("Fetched jobs:", data);
        setJobs(data || []);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setError("Failed to load job applications");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  // Filter and search jobs
  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    // Apply status filter
    if (filter && filter !== "all") {
      filtered = filtered.filter(
        (job) => job.status.toLowerCase() === filter.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.address.toLowerCase().includes(query) ||
          (job.notes && job.notes.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [jobs, filter, searchQuery]);

  const handleJobAdded = (newJob) => {
    setJobs((prevJobs) => [newJob, ...prevJobs]);
  };

  useImperativeHandle(ref, () => ({
    addJob: handleJobAdded,
  }));

  const handleDelete = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job application?")) {
      return;
    }

    try {
      await deleteJob(jobId, token);
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Failed to delete job application");
    }
  };

  const handleEditFromDetails = (job) => {
    setSelectedJob(null);
    setEditingJob(job);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
  };

  const handleEditComplete = (updatedJob) => {
    setJobs(jobs.map((job) => (job._id === updatedJob._id ? updatedJob : job)));
    setEditingJob(null);
  };

  const handleDeleteComplete = (deletedJob) => {
    setJobs(jobs.filter((job) => job._id !== deletedJob._id));
    setEditingJob(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "applied":
        return <ListPlus className="h-4 w-4 text-blue-600" />;
      case "interviewing":
        return <MessageCircle className="h-4 w-4 text-yellow-600" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "withdrawn":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Hourglass className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLocationIcon = (location) => {
    switch (location) {
      case "remote":
        return <Laptop className="h-4 w-4 text-green-600" />;
      case "onsite":
        return <Building2 className="h-4 w-4 text-blue-600" />;
      case "hybrid":
        return <Home className="h-4 w-4 text-purple-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "interviewing":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "offer received":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "withdrawn":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-[#193948]">Loading job applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="text-[#193948] text-lg mb-2">
          No job applications yet
        </div>
        <div className="text-[#193948]/60">
          Start by adding your first application!
        </div>
      </div>
    );
  }

  if (filteredJobs.length === 0) {
    return (
      <div className="p-5">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between px-5 pt-5 sm:pb-5">
            <h2 className="font-medium text-xl text-[#193948]">
              All applications ({jobs.length})
            </h2>
          </div>
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-[#193948] text-lg mb-2">
              No applications match your criteria
            </div>
            <div className="text-[#193948]/60">
              {filter && filter !== "all"
                ? `No applications with status "${filter}"`
                : searchQuery
                ? `No results found for "${searchQuery}"`
                : "Try adjusting your filters"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between px-5 pt-5 sm:pb-5">
          <h2 className="font-medium text-xl text-[#193948]">
            {filter && filter !== "all" ? (
              <>
                {filter.charAt(0).toUpperCase() + filter.slice(1)} applications
                ({filteredJobs.length})
              </>
            ) : (
              <>
                All applications ({filteredJobs.length}
                {jobs.length !== filteredJobs.length
                  ? ` of ${jobs.length}`
                  : ""}
                )
              </>
            )}
          </h2>
        </div>

        <div className="px-5 pb-2">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-all cursor-pointer rounded-lg px-2 -mx-2"
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(job.status)}
                  {getLocationIcon(job.location)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[#193948] text-sm truncate">
                      {job.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 shrink-0 ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </Badge>
                  </div>

                  <div className="text-xs text-[#193948]/60 mb-1">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span className="font-medium truncate">
                        {job.company}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-[#193948]/50 flex items-center gap-3">
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{job.address}</span>
                    </div>
                    <span className="shrink-0">
                      Applied {formatDate(job.dateApplied)}
                    </span>
                  </div>

                  {job.notes && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-[#193948]/40">
                      <StickyNote className="h-3 w-3 shrink-0" />
                      <span className="truncate">{job.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(job);
                  }}
                  className="p-1.5 text-[#193948]/60 hover:text-[#193948] hover:bg-white rounded transition-colors cursor-pointer"
                  title="Edit application"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(job._id);
                  }}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-white rounded transition-colors cursor-pointer"
                  title="Delete application"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Job Details Dialog */}
      {selectedJob && (
        <JobDetailsDialog
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          onEditClick={handleEditFromDetails}
        />
      )}

      {/* Edit Dialog */}
      {editingJob && (
        <EditDialog
          job={editingJob}
          isOpen={!!editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleEditComplete}
          onDelete={handleDeleteComplete}
        />
      )}
    </div>
  );
});

JobItems.displayName = "JobItems";

export default JobItems;
