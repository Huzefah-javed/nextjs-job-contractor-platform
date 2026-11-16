"use client";

import React, { useState } from "react";
import AdminMilestoneReviewModal from "./AdminMilestonesSetup";

export default function EscrowProjectCard({
  title,
  contractor,
  client,
  milestoneAmount,
  transactionId,
  statusText,
  statusVariant = "pending", // "pending" | "approved" | "released"
  showMilestones = false,
  onToggleMilestones,
  milestones = [],
  onReleaseMilestone,
}) {
  const [milestoneAppear, setMilestoneAppear] = useState(false);

  const badgeStyles = {
    pending: "bg-[#D99B38] text-white",
    approved: "bg-[#1C1C1C] text-white",
    released: "bg-[#189E0E] text-white",
  };

  const milestoneStatusStyles = {
    Completed: "bg-[#189E0E]/10 text-[#189E0E] border-[#189E0E]/30",
    "In Progress": "bg-[#D99B38]/15 text-[#B47B1E] border-[#D99B38]/30",
    Pending: "bg-gray-100 text-gray-500 border-gray-200",
    Released: "bg-gray-900 text-white border-gray-900",
  };

  return (
    <div className="w-full bg-white border border-[#DCDCDC] rounded-[18px] px-7 py-6 transition-all">
      {/* Top Row: Project Info & Status */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Left Details */}
        <div className="space-y-1">
          <h2 className="text-[19px] font-semibold text-[#189E0E] tracking-tight">
            {title}
          </h2>
          <p className="text-[13px] text-[#9E9E9E]">
            Contractor: <span className="text-[#8C8C8C]">{contractor}</span>
          </p>
          <p className="text-[13px] text-[#9E9E9E]">
            Client: <span className="text-[#8C8C8C]">{client}</span>
          </p>

          <div className="pt-2.5">
            <p className="text-[16px] font-semibold text-[#1A1A1A]">
              Total Milestones Amount:{" "}
              <span className="text-[#189E0E] font-bold">
                ${milestoneAmount}
              </span>
            </p>
          </div>
        </div>

        {/* Right Details: Transaction ID, Status Pill & Show Milestones Button */}
        <div className="flex flex-col md:items-end justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] text-[#9E9E9E]">
              Transaction ID: {transactionId}
            </span>
            <span
              className={`px-5 py-2 rounded-full text-[12px] font-medium whitespace-nowrap ${
                badgeStyles[statusVariant] || badgeStyles.pending
              }`}
            >
              {statusText}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMilestoneAppear(true)}
            className="px-6 py-2 rounded-full bg-[#9E9E9E] hover:bg-[#858585] text-white text-[13px] font-medium transition-colors cursor-pointer self-start md:self-end"
          >
            {milestoneAppear ? "Hide Milestones" : "Show Milestones"}
          </button>
        </div>
      </div>

      {/* Expandable Milestones Section */}
      {showMilestones && (
        <div className="mt-5 pt-5 border-t border-[#EAEAEA]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#1A1A1A]">
              Project Milestones ({milestones.length})
            </h3>
            <span className="text-[12px] text-[#9E9E9E]">
              Release funds individually per completed milestone
            </span>
          </div>
        </div>
      )}
      {milestoneAppear && (
        <AdminMilestoneReviewModal
          milestones={milestones}
          onClose={() => setMilestoneAppear(false)}
        />
      )}
    </div>
  );
}
