"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Layers, Loader2, AlertCircle } from "lucide-react";
import {
  getHiredProjects,
  reviewMilestonesAction,
} from "@/serverActions/hired-projects-actions";
import ProjectCard from "./components/ProjectCards"; // adjust path if needed

// Define tabs outside component to avoid recreation on each render
const FILTER_TABS = [
  { id: "milestone_ready", label: "Milestone Ready" },
  { id: "active", label: "Active Projects" },
  { id: "awaiting_milestones", label: "Awaiting Milestones" },
  { id: "completed", label: "Completed Projects" },
];

export default function HiredProjectsPage() {
  const [activeTab, setActiveTab] = useState("milestone_ready");
  const [projects, setProjects] = useState([]);
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState(null);

  useEffect(() => {
    startTransition(async () => {
      setError(null);
      const res = await getHiredProjects(activeTab);
      if (res.success) {
        setProjects(res.projects);
      } else {
        setError(res.error);
      }
    });
  }, [activeTab]);

  const handleReview = async ({
    projectId,
    milestones,
    jobTitle,
    jobDescription,
    action,
    sellerId,
  }) => {
    startTransition(async () => {
      const res = await reviewMilestonesAction({
        projectId,
        milestones,
        jobTitle,
        jobDescription,
        action,
        sellerId,
      });
      if (res.success) {
        const updated = await getHiredProjects(activeTab);
        if (updated.success) setProjects(updated.projects);
      } else {
        alert(`Failed: ${res.error}`);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hired Projects</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review milestones, track active developments, and view completed
          contracts.
        </p>
      </div>

      <div className="flex border-b border-gray-200 gap-8 overflow-x-auto no-scrollbar">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? "text-[#16A34A] border-b-2 border-[#16A34A]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#16A34A]" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <Layers className="mx-auto text-gray-400 mb-3" size={36} />
              <h3 className="text-sm font-bold text-gray-800">
                No projects found
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                There are no projects in this status right now.
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                activeTab={activeTab}
                onReview={handleReview}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
