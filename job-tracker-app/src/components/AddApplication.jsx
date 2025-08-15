import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Briefcase,
  Building2,
  MapPin,
  FileText,
  Calendar,
  X as CloseIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuth from "@/hooks/useAuth";
import { createJob } from "../api";

export default function AddApplication({ open, onOpenChange, onJobAdded }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    address: "",
    location: "",
    status: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const locationOptions = [
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "onsite", label: "On-site" },
  ];

  const statusOptions = [
    { value: "applied", label: "Applied" },
    { value: "interviewing", label: "Interviewing" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "withdrawn", label: "Withdrawn" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.title.trim()) {
      setError("Job title is required");
      setLoading(false);
      return;
    }
    if (!formData.company.trim()) {
      setError("Company is required");
      setLoading(false);
      return;
    }
    if (!formData.address.trim()) {
      setError("Address is required");
      setLoading(false);
      return;
    }
    if (!formData.location) {
      setError("Location type is required");
      setLoading(false);
      return;
    }
    if (!formData.status) {
      setError("Status is required");
      setLoading(false);
      return;
    }

    try {
      const jobData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        address: formData.address.trim(),
        location: formData.location,
        status: formData.status,
        notes: formData.notes.trim(),
      };

      const newJob = await createJob(jobData, token);

      setFormData({
        title: "",
        company: "",
        address: "",
        location: "",
        status: "",
        notes: "",
      });

      if (onJobAdded) {
        onJobAdded(newJob);
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create job:", error);
      setError(error.message || "Failed to add job application");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: "",
        company: "",
        address: "",
        location: "",
        status: "",
        notes: "",
      });
      setError("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={loading ? () => {} : onOpenChange}>
      <DialogContent
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   bg-gradient-to-br from-white via-white to-[#fefcf0]
                   rounded-3xl p-0 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.35)]
                   border border-[#f0f4f8]
                   w-[min(960px,calc(100vw-4rem))]
                   max-h-[calc(100vh-4rem)]
                   overflow-hidden"
        showCloseButton={false}
      >
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <DialogHeader className="px-6 pt-6 pb-4 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FCDC73] via-[#f4d861] to-[#FCDC73] rounded-t-3xl" />

            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#FCDC73] to-[#f4d861] 
                              shadow-[0_8px_24px_-12px_rgba(252,220,115,0.6)] grid place-items-center"
              >
                <Plus className="h-6 w-6 text-[#193948]" />
              </div>
              <div>
                <DialogTitle className="text-left text-xl font-bold text-[#193948] leading-snug">
                  Add New Application
                </DialogTitle>
                <DialogDescription className="text-left text-sm text-[#5b6d76]">
                  Track a new job opportunity
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="px-4 pb-4 sm:px-6 sm:pb-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Job Title */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[#193948]">
                  <Briefcase className="h-4 w-4 text-[#7b8a92]" />
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-2xl border border-[#e9eef2] bg-white/60
                             focus:border-[#FCDC73] focus:ring-2 focus:ring-[#FCDC73]/20 focus:bg-white
                             text-[#193948] placeholder:text-[#8aa0aa] outline-none transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[#193948]">
                  <Building2 className="h-4 w-4 text-[#7b8a92]" />
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="e.g. Google Inc."
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-2xl border border-[#e9eef2] bg-white/60
                             focus:border-[#FCDC73] focus:ring-2 focus:ring-[#FCDC73]/20 focus:bg-white
                             text-[#193948] placeholder:text-[#8aa0aa] outline-none transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[#193948]">
                  <MapPin className="h-4 w-4 text-[#7b8a92]" />
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="e.g. Ortigas, Pasig City"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-2xl border border-[#e9eef2] bg-white/60
                             focus:border-[#FCDC73] focus:ring-2 focus:ring-[#FCDC73]/20 focus:bg-white
                             text-[#193948] placeholder:text-[#8aa0aa] outline-none transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Location Type & Status - Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#193948]">
                    Location Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) =>
                      handleInputChange("location", value)
                    }
                    required
                    disabled={loading}
                  >
                    <SelectTrigger
                      className="w-full px-4 py-3 rounded-2xl border border-[#e9eef2] bg-white/60
                                             focus:border-[#FCDC73] focus:ring-2 focus:ring-[#FCDC73]/20 focus:bg-white
                                             text-[#193948] outline-none transition-all
                                             disabled:opacity-50"
                    >
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-[#e9eef2] bg-white shadow-lg">
                      {locationOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="rounded-lg"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#193948]">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                    required
                    disabled={loading}
                  >
                    <SelectTrigger
                      className="w-full px-4 py-3 rounded-2xl border border-[#e9eef2] bg-white/60
                                             focus:border-[#FCDC73] focus:ring-2 focus:ring-[#FCDC73]/20 focus:bg-white
                                             text-[#193948] outline-none transition-all
                                             disabled:opacity-50"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-[#e9eef2] bg-white shadow-lg">
                      {statusOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="rounded-lg"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[#193948]">
                  <FileText className="h-4 w-4 text-[#7b8a92]" />
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Add any additional notes..."
                  rows={3}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-2xl border border-[#e9eef2] bg-white/60
                             focus:border-[#FCDC73] focus:ring-2 focus:ring-[#FCDC73]/20 focus:bg-white
                             text-[#193948] placeholder:text-[#8aa0aa] outline-none transition-all
                             resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col justify-end sm:flex-row gap-3 mt-3 pt-4 border-t border-[#f0f4f8]">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl border border-[#e9eef2] bg-white/80 
                           text-[#5b6d76] hover:bg-white hover:border-[#d1d9e0] 
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FCDC73]/30
                           transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? {} : { y: -1, scale: 1.02 }}
                whileTap={loading ? {} : { y: 0, scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                  mass: 0.7,
                }}
                className="group relative overflow-hidden flex-1 sm:flex-none inline-flex items-center justify-center gap-2 
                           rounded-2xl px-6 py-3 text-[#193948] font-medium
                           bg-[linear-gradient(180deg,#FCDC73_0%,#f4d861_100%)]
                           shadow-[0_16px_32px_-16px_rgba(252,220,115,0.6)]
                           hover:brightness-[.98] active:brightness-95
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FCDC73]/60 
                           transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="pointer-events-none absolute inset-0">
                  <span
                    className="absolute -inset-y-6 -left-1/3 w-1/3 rotate-12 bg-white/40 blur-md opacity-0 transition-all duration-700
                                   group-hover:opacity-60 group-hover:translate-x-[250%] group-active:opacity-40"
                  />
                </span>
                <Plus className="h-4 w-4" />
                {loading ? "Adding..." : "Add Application"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
