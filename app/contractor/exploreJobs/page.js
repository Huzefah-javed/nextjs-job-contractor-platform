"use client";

import { getProjectsPaginatedAction } from "@/serverActions/getProjectsPaginatedAction";
import React, { useState, useEffect, useTransition } from "react";
import SubmitProposalModal from "./components/SubmitProposalModal";

export default function ContractorJobsList() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function loadJobs() {
      setIsLoading(true);
      try {
        const res = await getProjectsPaginatedAction(
          page,
          ITEMS_PER_PAGE,
          "approved",
        );
        if (res.success) {
          setJobs(res.data);
          setTotalPages(res.pagination.totalPages);
          setTotalItems(res.pagination.totalProjects);
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadJobs();
  }, [page]);

  const handleOpenProposal = (job) => {
    setSelectedJob(job);
    setIsProposalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl p-6 h-40 animate-pulse border border-gray-100 shadow-sm"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans p-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">
            Available Jobs
          </p>
          <p className="text-sm font-bold text-gray-800">{totalItems}</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">
            Proposals Sent
          </p>
          <p className="text-sm font-bold text-gray-800">12</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">Interviewing</p>
          <p className="text-sm font-bold text-[#D9A34A]">3</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">
            Active Contracts
          </p>
          <p className="text-sm font-bold text-[#16A34A]">2</p>
        </div>
      </div>

      {/* Job Cards Feed */}
      {jobs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-sm font-medium text-gray-500">
          No available jobs found at the moment.
        </div>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-green-300 transition-all"
          >
            {/* Top Right Budget Tag */}
            <div className="absolute top-6 right-6">
              <span className="bg-green-50 text-[#16A34A] border border-green-200 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
                {job.budgetRange || "$25k - $50k"}
              </span>
            </div>

            {/* Job Information */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {job.license || "Full Stack"}
                </span>
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {job.name}
              </h2>

              <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                {job.projectDescription ||
                  "Looking for an experienced engineer to build a modern, high-performance web platform."}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-5">
                <p>
                  Location:{" "}
                  <span className="text-gray-700">
                    {job.region || "Remote"}
                  </span>
                </p>
                <p>
                  Est. Duration: <span className="text-gray-700">8 Weeks</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-[11px] text-gray-400">Posted recently</span>

              <button
                type="button"
                onClick={() => handleOpenProposal(job)}
                className="bg-[#16A34A] hover:bg-green-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                Apply Now →
              </button>
            </div>
          </div>
        ))
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-6 py-4 mt-6">
          <p className="text-xs font-medium text-gray-400">
            Page <span className="font-bold text-gray-700">{page}</span> of{" "}
            <span className="font-bold text-gray-700">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-all"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {selectedJob && (
        <SubmitProposalModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
