"use client";

import React, { useState, useEffect } from "react";
import { getContractorProjectsAction } from "@/serverActions/getContractorProjectsAction";
import SetupMilestoneModal from "./components/milestoneSetup";
import { Info } from "lucide-react";
import MilestoneUpdateModal from "./components/milestoneUpdate";

export default function MyProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("active");

  const [projectMilestoneModalData, setProjectMilestoneModalData] = useState(
    {},
  );
  const [updateOption, setUpdateOption] = useState({});

  const filters = [
    { label: "All Projects", value: "all" },
    { label: "Active", value: "active" },
    { label: "milestone setup required", value: "hired" },
    { label: "Completed", value: "completed" },
  ];

  const filterDescriptions = {
    all: "View all of your project contracts across every phase.",
    hired:
      "The client has accepted your proposal! Set up your milestones now so the client can fund the escrow.",
    active:
      "These are your ongoing projects that you are currently working on.",
    completed:
      "These are the projects you have successfully completed and delivered.",
  };

  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true);
      try {
        const res = await getContractorProjectsAction(currentFilter);
        if (res.success) {
          setProjects(res.data);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [currentFilter]);

  console.log(projects);

  const handleUpdateProgress = (projectId) => {
    console.log("Opening progress update modal for:", projectId);
  };

  const handleSetupMilestone = (projectId, proposalPrice, projectDuration) => {
    setProjectMilestoneModalData({ projectId, proposalPrice, projectDuration });
  };

  return (
    <div className="font-sans p-6 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-5 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your hired projects, track milestones, and update your clients.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setCurrentFilter(filter.value)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              currentFilter === filter.value
                ? "bg-[#16A34A] text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {filter.label}
          </button>
        ))}
        <div className="bg-[#16A34A]/10 border border-[#16A34A]/20 rounded-lg px-3 py-2.5 mb-6 flex items-center gap-2 transition-all mt-6 w-full md:w-auto md:mt-0">
          <Info className="text-[#16A34A] shrink-0" size={16} />
          <p className="text-xs font-medium text-green-800">
            {filterDescriptions[currentFilter] ||
              "View and manage your projects."}
          </p>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-[24px] p-6 h-40 animate-pulse border border-gray-100 shadow-sm"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-[24px] p-10 text-center text-sm font-medium text-gray-500 shadow-sm">
          No projects found for this phase.
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const milestones = project.milestones || [];
            const totalCount = milestones.length;
            const completedCount = milestones.filter(
              (m) =>
                m.status === "completed" ||
                m.status === "released" ||
                m.status === "approved",
            ).length;

            let progressPercentage = 0;
            let progressLabel = "";

            if (totalCount > 0) {
              if (project.projectPhase === "completed") {
                progressLabel = "ALL MILESTONES COMPLETED";
                progressPercentage = 100;
              } else {
                progressPercentage = Math.round(
                  (completedCount / totalCount) * 100,
                );
                const currentMilestoneNumber =
                  Math.min(completedCount + 1, totalCount) || 1;
                progressLabel =
                  completedCount === totalCount
                    ? "ALL MILESTONES COMPLETED"
                    : `MILESTONE ${currentMilestoneNumber} IN PROGRESS`;
              }
            }

            return (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-6"
              >
                {/* Top Section: Title & Budget Badge */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#16A34A]">
                      {project.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Client: {project.clientName || "Unknown"} • Deadline:{" "}
                      {project.deadline || "TBD"}
                    </p>
                  </div>

                  <div className="bg-[#16A34A] text-white px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm">
                    ${project.budget?.toLocaleString() || 0} in budget
                  </div>
                </div>

                {/* Middle Section: Progress Bar (Only visible if milestones exist) */}
                {totalCount > 0 && (
                  <div className="w-full">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                      {progressLabel}
                    </p>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-[#16A34A] h-full rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Bottom Section: Action Buttons */}
                <div className="flex items-center gap-3 mt-1">
                  {/* Universal Secondary Button */}
                  <button className="bg-[#9CA3AF] hover:bg-gray-500 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer">
                    View Details
                  </button>

                  {/* Context-Aware Primary Actions */}
                  {project.projectPhase === "active" && (
                    <button
                      onClick={() =>
                        setUpdateOption({
                          milestones: project.milestones,
                          projectId: project.id,
                        })
                      }
                      className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer shadow-sm"
                    >
                      Update Progress
                    </button>
                  )}

                  {project.projectPhase === "hired" && (
                    <button
                      onClick={() =>
                        handleSetupMilestone(
                          project.id,
                          project.budget,
                          project.duration,
                        )
                      }
                      className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer shadow-sm"
                    >
                      Setup Milestone
                    </button>
                  )}

                  {project.projectPhase === "completed" && (
                    <button className="bg-gray-100 text-gray-400 px-6 py-2.5 rounded-full font-medium text-sm cursor-not-allowed">
                      Project Closed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Handling */}
      {Object.keys(projectMilestoneModalData).length > 0 && (
        <SetupMilestoneModal
          onClose={() => setProjectMilestoneModalData({})}
          projectId={projectMilestoneModalData.projectId}
          proposalPrice={projectMilestoneModalData.proposalPrice}
          projectDuration={projectMilestoneModalData.projectDuration}
        />
      )}

      {Object.keys(updateOption).length > 0 && (
        <MilestoneUpdateModal
          projectId={updateOption.projectId}
          milestones={updateOption.milestones}
          onUpdateStatus={(milestoneId) => {
            console.log(
              "Tell the backend that milestone ID is ready for client review:",
              milestoneId,
            );
          }}
          onClose={() => setUpdateOption({})}
        />
      )}
    </div>
  );
}
