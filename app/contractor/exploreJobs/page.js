"use client";

import { getProjectsPaginatedAction } from "@/serverActions/getProjectsPaginatedAction";
import React, { useState, useEffect } from "react";
import SubmitProposalModal from "./components/SubmitProposalModal";

export default function ContractorJobsList() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isProposalOpen, setIsProposalOpen] = useState(false);

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

  const handleCloseProposal = () => {
    setSelectedJob(null);
    setIsProposalOpen(false);
  };

  const startItem = totalItems === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, totalItems);

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
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
      {/* Header replacing metric cards */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Available Jobs</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Browse active client listings and submit proposals
          </p>
        </div>
        <span className="text-xs font-semibold bg-green-50 text-[#16A34A] border border-green-200 px-3 py-1 rounded-full">
          {totalItems} Open {totalItems === 1 ? "Job" : "Jobs"}
        </span>
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
            <div className="absolute top-6 right-6">
              <span className="bg-green-50 text-[#16A34A] border border-green-200 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
                {job.budgetRange || "$25k - $50k"}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {job.license || "Full Stack"}
                </span>
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {job.projectTitle}
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

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-[11px] text-gray-400">Posted recently</span>

              <button
                type="button"
                onClick={() => handleOpenProposal(job)}
                className="bg-[#16A34A] hover:bg-green-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
              >
                Apply Now →
              </button>
            </div>
          </div>
        ))
      )}

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-200 rounded-2xl px-6 py-4 mt-6 gap-4">
          <p className="text-xs font-medium text-gray-500">
            Showing <span className="font-bold text-gray-800">{startItem}</span>{" "}
            to <span className="font-bold text-gray-800">{endItem}</span> of{" "}
            <span className="font-bold text-gray-800">{totalItems}</span> jobs
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      page === pageNum
                        ? "bg-[#16A34A] text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Proposal Modal */}
      {isProposalOpen && selectedJob && (
        <SubmitProposalModal job={selectedJob} onClose={handleCloseProposal} />
      )}
    </div>
  );
}
