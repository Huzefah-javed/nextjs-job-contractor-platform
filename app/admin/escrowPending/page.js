"use client";

import React, { useState, useEffect } from "react";
import PendingEscrowCard from "./components/PendingEscrowCard";
import { getPendingEscrowProjectsAction } from "@/serverActions/adminEscrowPendings";
import LoadingSpinner from "@/app/loading";

export default function AdminPendingEscrowList() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPendingProjects() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await getPendingEscrowProjectsAction();

        if (res.success) {
          setProjects(res.data || []);
        } else {
          setError(res.message || "Failed to load projects.");
        }
      } catch (err) {
        console.error("Error inside useEffect:", err);
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPendingProjects();
  }, []);

  const handleCreateTransaction = (project) => {
    console.log("Creating transaction for project:", project.projectId);
    // Modal or navigation logic to start transaction creation
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pending Escrow Creation
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Projects approved by client awaiting admin escrow transaction setup.
          </p>
        </div>
        <span className="bg-[#16A34A]/10 text-[#16A34A] font-bold text-xs px-4 py-1.5 rounded-full border border-[#16A34A]/20">
          {projects.length} Total
        </span>
      </div>

      {isLoading ? (
        <div className="bg-white border border-gray-200 rounded-[24px] p-16 flex flex-col items-center justify-center gap-3">
          <LoadingSpinner />
          <p className="text-xs text-gray-500 font-medium">
            Fetching pending escrow projects...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-[24px] p-8 text-center text-red-600 text-sm font-medium">
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-[24px] p-12 text-center text-gray-400 text-sm">
          No projects pending escrow setup.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {projects.map((project) => (
            <PendingEscrowCard
              key={project.projectId}
              project={project}
              onCreateTransaction={handleCreateTransaction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
