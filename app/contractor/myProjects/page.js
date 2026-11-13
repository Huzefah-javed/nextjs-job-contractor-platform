"use client";

import React, { useState, useEffect } from "react";
import SetupMilestoneModal from "../../components/milestoneSetup";
import { Info } from "lucide-react";
import MilestoneUpdateModal from "./components/milestoneUpdate";
import { getHiredProjects } from "@/serverActions/hired-projects-actions";

export default function MyProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("active");

  const [projectMilestoneModalData, setProjectMilestoneModalData] = useState(
    {},
  );
  const [updateOption, setUpdateOption] = useState({});

  const filters = [
    { value: "active", label: "Active Projects" },
    { value: "escrowPending", label: "Escrow pendings" },
  ];

  const filterDescriptions = {
    escrowPending:
      "You and client need to complete escrow phase in order to make project active",
    active:
      "These are your ongoing projects that you are currently working on.",
  };

  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true);
      try {
        const res = await getHiredProjects(currentFilter);
        if (res.success) {
          setProjects(res.projects || []);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [currentFilter]);

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
          {projects.map((item) => {
            const projectInfo = item.project || {};
            const proposalInfo = item.proposal || {};
            // Filter out any invalid string placeholders if they leaked into milestones array from backend parsing
            const milestones = (item.milestones || []).filter(
              (m) => typeof m === "object" && m !== null,
            );

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
              if (item.projectPhase === "completed") {
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

            const projectPhase = item.projectPhase || "active";

            return (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-6"
              >
                {/* Top Section: Title & Budget Badge */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#16A34A]">
                      {projectInfo.projectTitle || "Untitled Project"}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Category: {projectInfo.projectCategory || "N/A"} •
                      Duration:{" "}
                      {milestones.reduce(
                        (acc, elem) => (acc += Number(elem.deadline)),
                        0,
                      ) + " weeks" || "TBD"}
                    </p>
                  </div>

                  <div className="bg-[#16A34A] text-white px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm">
                    $
                    {milestones.reduce(
                      (acc, elem) => (acc += elem.amount),
                      0,
                    ) || 0}{" "}
                    in budget
                  </div>
                </div>

                {/* Middle Section: Progress Bar */}
                {currentFilter !== "escrowPending" && totalCount > 0 && (
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
                  {projectPhase === "escrowPending" && (
                    <button
                      // onClick={() => setShowEscrowModalwithId(project._id)}
                      className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer shadow-sm"
                    >
                      View Escrow status
                    </button>
                  )}
                  {projectPhase === "active" && (
                    <button
                      onClick={() =>
                        setUpdateOption({
                          milestones: milestones,
                          projectId: item._id,
                        })
                      }
                      className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer shadow-sm"
                    >
                      Update Progress
                    </button>
                  )}

                  {projectPhase === "milestoneSetup" && (
                    <button
                      onClick={() =>
                        handleSetupMilestone(
                          item._id,
                          proposalInfo.proposedBudget,
                          proposalInfo.estimatedDuration,
                        )
                      }
                      className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer shadow-sm"
                    >
                      Setup Milestone
                    </button>
                  )}

                  {projectPhase === "hiredAwaitingEscrowFulfillment" && (
                    <button className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer shadow-sm">
                      Escrow status
                    </button>
                  )}

                  {projectPhase === "completed" && (
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
