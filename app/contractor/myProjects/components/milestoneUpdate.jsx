"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, X, AlertCircle } from "lucide-react";
import { submitMilestoneAction } from "@/serverActions/submitMilestoneAction";
import LoadingSpinner from "@/app/loading";

export default function MilestoneUpdateModal({
  milestones,
  escrowId,
  onUpdateStatus,
  onClose,
}) {
  const [loading, setLoading] = useState(false);

  async function handleProjectSubmit(milestoneId) {
    if (!escrowId) {
      console.error("escrow ID is not available.");
      return;
    }

    try {
      setLoading(true);
      const response = await submitMilestoneAction(escrowId, milestoneId);

      if (response.success) {
        console.log("Success:", response.message);
        if (onUpdateStatus) onUpdateStatus();
      } else {
        console.error("Error:", response.message);
      }
    } catch (error) {
      console.error("Unexpected error submitting milestone:", error);
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
          <h2 className="text-xl font-bold text-gray-900">
            Project Milestones
          </h2>
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
              No milestones available.
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
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {milestones.map((milestone) => {
                  const statusStr =
                    milestone.status?.toLowerCase().trim() || "";

                  // Exactly three statuses configured
                  const isUnderProgress =
                    statusStr === "under progress" ||
                    statusStr === "underprogress";
                  const isPending = statusStr === "pending";
                  const isCompleted = statusStr === "completed";

                  // Dynamic Badge & Status Styling
                  let statusClasses = "bg-gray-100 text-gray-600";
                  if (isUnderProgress) {
                    statusClasses =
                      "bg-blue-50 text-blue-600 border border-blue-100";
                  } else if (isPending) {
                    statusClasses =
                      "bg-amber-50 text-amber-600 border border-amber-100";
                  } else if (isCompleted) {
                    statusClasses =
                      "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20";
                  }

                  return (
                    <tr
                      key={milestone._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {milestone.title?.includes("-")
                          ? milestone.title.split("-")[0].slice(0, 30)
                          : milestone.title}
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
                        {isUnderProgress ? (
                          <button
                            onClick={() => handleProjectSubmit(milestone._id)}
                            className="px-5 py-2.5 rounded-full font-medium text-xs transition-all inline-flex items-center justify-center gap-2 shadow-sm bg-[#16A34A] hover:bg-green-700 text-white cursor-pointer"
                          >
                            Submit Work
                          </button>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/60">
                            <Clock size={13} />
                            Awaiting Review / Escrow
                          </span>
                        ) : isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#16A34A] bg-[#16A34A]/10 px-3 py-1.5 rounded-lg border border-[#16A34A]/20">
                            <CheckCircle2 size={13} />
                            Completed
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            No action available
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
