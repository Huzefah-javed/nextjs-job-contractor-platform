"use client";

import React, { useState } from "react";
import { X, Check, ShieldCheck } from "lucide-react";

export default function MilestoneReviewModal({
  milestones = [],
  projectId,
  onClose,
}) {
  const [loading, setLoading] = useState(false);

  const totalMilestoneAmount = milestones.reduce(
    (acc, m) => acc + (Number(m.amount) || 0),
    0,
  );

  const handleApprove = async (milestoneId) => {
    // Add your approve milestone API logic here
    console.log("Approve milestone:", milestoneId, "for project:", projectId);
  };

  const handleReject = async (milestoneId) => {
    // Add your reject/revision milestone API logic here
    console.log("Reject milestone:", milestoneId, "for project:", projectId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-gray-200 rounded-[24px] shadow-xl w-full max-w-4xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

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
        <div className="overflow-x-auto overflow-y-auto p-8 bg-white space-y-6">
          {/* Financial Summary Box */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Total Project Budget
              </p>
              <p className="text-2xl font-bold text-[#16A34A] mt-0.5">
                ${totalMilestoneAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Total Milestones
              </p>
              <p className="text-lg font-bold text-gray-800 mt-0.5">
                {milestones.length}
              </p>
            </div>
          </div>

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
                  <th className="px-6 py-4">Duration</th>
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
                      <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                        {milestone.title.split("-")[0].slice(0, 30)}
                      </td>

                      <td className="px-6 py-4 text-[#16A34A] font-bold whitespace-nowrap">
                        ${Number(milestone.amount || 0).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                        {milestone.weeks || milestone.deadline || "N/A"} Weeks
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

          {/* Escrow Protection Notice */}
          <div className="bg-[#16A34A]/10 border border-[#16A34A]/20 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="text-[#16A34A] shrink-0 mt-0.5" size={20} />
            <div className="text-xs text-green-900">
              <p className="font-bold">Protected by Escrow</p>
              <p className="mt-0.5 text-green-800">
                Milestones are locked securely and funds are released upon your
                final approval.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-8 py-5 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
