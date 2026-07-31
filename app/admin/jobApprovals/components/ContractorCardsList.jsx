"use client";

import { approveProjectAction } from "@/serverActions/approveProjectAction";
import { getProjectsPaginatedAction } from "@/serverActions/getProjectsPaginatedAction";
import React, { useState, useEffect, useTransition } from "react";
import ProjectDetailsModal from "./ProjectDetailModel";

export default function ContractorCardsList() {
  const [contractors, setContractors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(true);
  const [view, setView] = useState(null);
  const [isPending, startTransition] = useTransition();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function loadContractors() {
      setIsLoading(true);
      try {
        const res = await getProjectsPaginatedAction(page, ITEMS_PER_PAGE);

        if (res.success) {
          setContractors(res.data);
          setTotalPages(res.pagination.totalPages);
          setTotalItems(res.pagination.totalProjects);
        }
      } catch (err) {
        console.error("Failed to load contractors:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadContractors();
  }, [page, refreshKey]);

  const handleToggle = (id) => {
    startTransition(async () => {
      await approveProjectAction(id);
      setRefreshKey((prev) => !prev);
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl p-6 h-36 animate-pulse border border-gray-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contractors?.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-sm font-medium text-gray-500">
          No records found.
        </div>
      ) : (
        contractors?.map((contractor) => (
          <div
            key={contractor._id}
            className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
          >
            {/* Status Badge */}
            <div className="absolute top-6 right-6">
              <span className="bg-[#D9A34A] text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full shadow-sm capitalize">
                {contractor.status}
              </span>
            </div>

            {/* Details & Toggle */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-base font-bold text-[#16A34A]">
                  {contractor.projectTitle}
                </h2>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggle(contractor._id)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    contractor.isActive ? "bg-[#16A34A]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      contractor.isActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="text-xs text-gray-400 font-medium space-y-0.5 mb-5">
                <p>Category: {contractor.projectCategory}</p>
                <p>Location: {contractor.location}</p>
              </div>
            </div>

            {/* Action Button */}
            <div>
              <button
                type="button"
                onClick={() => setView(contractor)}
                className="bg-[#1C1C1E] hover:bg-black text-white text-xs font-medium px-4 py-2 rounded-xl transition-all"
              >
                View Documents
              </button>
            </div>
          </div>
        ))
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-6 py-4 mt-6">
          <p className="text-xs font-medium text-gray-400">
            Page <span className="font-bold text-gray-700">{page}</span> of{" "}
            <span className="font-bold text-gray-700">{totalPages}</span> (
            {totalItems} total)
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
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
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      page === pageNum
                        ? "bg-[#16A34A] text-white"
                        : "text-gray-500 hover:bg-gray-100"
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
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {view && (
        <ProjectDetailsModal project={view} onClose={() => setView(null)} />
      )}
    </div>
  );
}
