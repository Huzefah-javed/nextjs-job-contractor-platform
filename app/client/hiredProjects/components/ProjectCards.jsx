"use client";

import React, { useState } from "react";
import ClientMilestoneReviewModal from "./ClientMilestoneReviewModal";
import MilestoneReviewModal from "./MilestoneReviewModal";
import EscrowStatusModal from "@/app/components/escrowModal";

export default function ProjectCard({
  project,
  proposal,
  milestones,
  createdAt,
  escrowId,
  activeTab,
  onReview,
}) {
  const [showUpdateMilestones, setShowUpdateMilestones] = useState({});
  const [showMilestones, setShowMilestones] = useState(false);
  const [showEscrowModalwithId, setShowEscrowModalwithId] = useState(null);

  const title = project?.projectTitle || "Untitled Project";
  const description = project?.projectDescription || "No description provided.";
  const budget = proposal?.proposedBudget || 0;

  const currentMilestones = milestones || [];
  const totalCount = currentMilestones.length;
  const completedCount = currentMilestones.filter(
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
          ${milestones.reduce((acc, elem) => (acc += elem.amount), 0)} in total
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
        {activeTab === "active" && (
          <button
            onClick={() =>
              setShowUpdateMilestones({
                milestones: currentMilestones,
                projectId: escrowId,
              })
            }
            className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer shadow-sm"
          >
            View Details
          </button>
        )}

        {activeTab === "escrowPending" && (
          <button
            onClick={() => setShowEscrowModalwithId(project._id)}
            className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer shadow-sm"
          >
            View Escrow status
          </button>
        )}

        {activeTab === "hiredAwaitingEscrowFulfillment" && (
          <button
            className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer shadow-sm"
            onClick={() => setShowEscrowModalwithId(escrowId)}
          >
            Escrow status
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
          milestones={currentMilestones}
          onClose={() => setShowMilestones(false)}
        />
      )}

      {showEscrowModalwithId && (
        <EscrowStatusModal
          projectId={showEscrowModalwithId}
          onClose={() => setShowEscrowModalwithId(null)}
        />
      )}
    </div>
  );
}
