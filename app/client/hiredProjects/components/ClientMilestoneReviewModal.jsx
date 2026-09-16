"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { updateMilestoneStatusAction } from "@/serverActions/updateMilestoneStatusAction";
import LoadingSpinner from "@/app/loading";

export default function ClientMilestoneReviewModal({
  milestones,
  projectId,
  onClose,
}) {
  const [loading, setLoading] = useState(false);

  async function handleApprove(milestoneId) {
    try {
      setLoading(true);
      const res = await updateMilestoneStatusAction(
        projectId,
        milestoneId,
        "approved",
      );
      if (res.success) {
        console.log(res.message);
      } else {
        console.error(res.message);
      }
    } catch (error) {
      console.error("Error approving milestone:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  async function handleReject(milestoneId) {
    try {
      setLoading(true);
      const res = await updateMilestoneStatusAction(
        projectId,
        milestoneId,
        "rejected",
      );
      if (res.success) {
        console.log(res.message);
      } else {
        console.error(res.message);
      }
    } catch (error) {
      console.error("Error rejecting milestone:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-gray-200 rounded-[24px] shadow-xl w-full max-w-4xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {loading && <LoadingSpinner />}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Review Milestones
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review submitted work and choose to approve or request revisions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2.5 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-x-auto overflow-y-auto p-8 bg-white">
          {!milestones || milestones.length === 0 ? (
            <div className="text-center text-sm font-medium text-gray-500 py-10">
              No milestones available for review.
            </div>
          ) : (
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4 rounded-tl-[16px]">
                    Milestone Title
                  </th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right rounded-tr-[16px]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {milestones.map((milestone) => {
                  const statusStr = milestone.status?.toLowerCase() || "";
                  const isSubmitted = statusStr === "submitted";
                  const isApproved =
                    statusStr === "approved" ||
                    statusStr === "completed" ||
                    statusStr === "released";
                  const isRejected = statusStr === "rejected";

                  // Dynamic Badge Colors
                  let statusClasses = "bg-gray-100 text-gray-600";
                  if (isSubmitted) {
                    statusClasses =
                      "bg-amber-50 text-amber-700 border border-amber-200";
                  } else if (isApproved) {
                    statusClasses =
                      "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20";
                  } else if (isRejected) {
                    statusClasses =
                      "bg-red-50 text-red-600 border border-red-200";
                  }

                  return (
                    <tr
                      key={milestone._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {milestone.title}
                      </td>

                      <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                        ${milestone.amount?.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {milestone.deadline}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${statusClasses}`}
                        >
                          {milestone.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {isSubmitted ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReject(milestone._id)}
                              className="px-4 py-2 rounded-full font-medium text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <X size={14} /> Reject
                            </button>
                            <button
                              onClick={() => handleApprove(milestone._id)}
                              className="px-4 py-2 rounded-full font-medium text-xs bg-[#16A34A] hover:bg-green-700 text-white transition-colors cursor-pointer shadow-sm flex items-center gap-1"
                            >
                              <Check size={14} /> Approve
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">
                            {isApproved
                              ? "Approved"
                              : isRejected
                                ? "Revision Requested"
                                : "In Progress"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
