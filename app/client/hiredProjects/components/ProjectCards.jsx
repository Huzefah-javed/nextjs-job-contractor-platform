"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import ClientMilestoneReviewModal from "./ClientMilestoneReviewModal";
import MilestoneReviewModal from "./MilestoneReviewModal";

export default function ProjectCard({ project, activeTab, onReview }) {
  const [showUpdateMilestones, setShowUpdateMilestones] = useState({});
  const [showMilestones, setShowMilestones] = useState(false);

  const title = project.projectTitle || "Untitled Project";
  const description = project.projectDescription || "No description provided.";
  const budget = project.selectedProposalId?.proposedBudget || 0;

  const milestones = project.milestones || [];
  const totalCount = milestones.length;
  const completedCount = milestones.filter(
    (m) =>
      m.status === "completed" ||
      m.status === "released" ||
      m.status === "approved",
  ).length;

  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const currentMilestoneNumber = Math.min(completedCount + 1, totalCount) || 1;

  let progressLabel = "AWAITING MILESTONES";
  if (totalCount > 0) {
    if (completedCount === totalCount) {
      progressLabel = "ALL MILESTONES COMPLETED";
    } else {
      progressLabel = `MILESTONE ${currentMilestoneNumber} IN PROGRESS`;
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h3 className="text-xl font-semibold text-[#16A34A]">{title}</h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-1">
            {description}
          </p>
        </div>

        <div className="bg-[#16A34A] text-white px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm">
          ${budget.toLocaleString()} in budget
        </div>
      </div>

      {activeTab === "active" && (
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
      <div className="flex items-center gap-3 mt-1">
        <button className="bg-[#9CA3AF] hover:bg-gray-500 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer">
          View Details
        </button>

        {/* Dynamic Secondary Button based on Tab state */}
        {activeTab === "active" && (
          <button
            onClick={() =>
              setShowUpdateMilestones({
                milestones: project.milestones,
                projectId: project._id,
              })
            }
            className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer shadow-sm"
          >
            Update
          </button>
        )}

        {activeTab === "milestone_ready" && (
          <button
            onClick={() => setShowMilestones(true)}
            className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer shadow-sm"
          >
            Accept Milestones
          </button>
        )}
      </div>

      {Object.keys(showUpdateMilestones).length > 0 && (
        <ClientMilestoneReviewModal
          milestones={showUpdateMilestones.milestones}
          projectId={showUpdateMilestones.projectId}
          onClose={() => setShowUpdateMilestones({})}
        />
      )}
      {showMilestones && (
        <MilestoneReviewModal
          milestones={milestones}
          onClose={() => setShowModal(false)}
          onApprove={() =>
            onReview({
              projectId: project._id,
              milestones: milestones,
              jobTitle: title,
              jobDescription: description,
              action: "approve",
              sellerId: project?.selectedProposalId?.contractorId,
            })
          }
          onReject={() =>
            onReview({
              projectId: project._id,
              milestones: milestones,
              jobTitle: title,
              jobDescription: description,
              action: "reject",
              sellerId: project?.selectedProposalId?.contractorId,
            })
          }
        />
      )}
    </div>
  );
}
