"use client";

import React from "react";
import { X, ShieldCheck, CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function MilestoneReviewModal({
  milestones = [],
  onApprove,
  onReject,
  onClose,
  isLoading = false,
}) {
  const totalMilestoneAmount = milestones.reduce(
    (acc, m) => acc + (Number(m.amount) || 0),
    0,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-gray-200 rounded-[24px] shadow-xl w-full max-w-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Review Proposed Milestones
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review contractor proposed milestones before approving or
              rejecting.
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              disabled={isLoading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2.5 rounded-full transition-colors cursor-pointer disabled:opacity-50"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-8 overflow-y-auto space-y-6">
          {/* Financial Summary Box */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Total Milestone Budget
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

          {/* Milestones List */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Proposed Scope
            </h3>
            <div className="space-y-3">
              {milestones.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-4 text-center">
                  No milestones provided.
                </p>
              ) : (
                milestones.map((m, index) => (
                  <div
                    key={m._id || index}
                    className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-[#16A34A]">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {m.title || `Milestone ${index + 1}`}
                        </p>
                        {m.description && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {m.description}
                          </p>
                        )}
                        <p className="text-[11px] text-gray-400 mt-1">
                          Deadline: {m.deadline || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-gray-900">
                        ${Number(m.amount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Escrow Protection Notice */}
          <div className="bg-[#16A34A]/10 border border-[#16A34A]/20 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="text-[#16A34A] shrink-0 mt-0.5" size={20} />
            <div className="text-xs text-green-900">
              <p className="font-bold">Protected by Escrow</p>
              <p className="mt-0.5 text-green-800">
                Funds are held securely and released only when work is completed
                and approved by you.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-white">
          <button
            onClick={onReject}
            disabled={isLoading}
            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-6 py-2.5 rounded-full font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <XCircle size={16} />
            Reject
          </button>

          <button
            onClick={onApprove}
            disabled={isLoading}
            className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Approve & Fund Escrow
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
