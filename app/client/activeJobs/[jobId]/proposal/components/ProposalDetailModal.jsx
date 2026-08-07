"use client";

import { chatRoomCreationAction } from "@/serverActions/chatRoomAction";
import React, { useState } from "react";

export default function ProposalDetailModal({
  proposal,
  isOpen,
  onClose,
  statusUpdated,
}) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!isOpen || !proposal) return null;

  const isApproved = proposal.status?.toLowerCase() === "approved";
  const isRejected = proposal.status?.toLowerCase() === "rejected";

  const handleStatusChange = async (newStatus) => {
    await statusUpdated({ ...proposal, rejectionReason }, newStatus);
    onClose();
  };

  const handleChat = async () => {
    const obj = {
      jobId: proposal.jobId,
      contractorId: proposal.contractorId,
    };

    await chatRoomCreationAction(obj);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto font-sans">
      <div className="bg-white w-full rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col my-auto text-slate-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Proposal Application
            </span>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {proposal.contractorName}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border ${
                isApproved
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : isRejected
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {proposal.status}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/30">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Contact Email
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">
                {proposal.contractorEmail}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Proposed Budget
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                ${proposal.proposedBudget?.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Estimated Timeline
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                {proposal.estimatedDuration}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cover Letter
            </h3>
            <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 leading-relaxed whitespace-pre-line font-normal">
              {proposal.coverLetter}
            </div>
          </div>

          {proposal.rejectionReason && (
            <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                Rejection Note
              </span>
              <p className="text-xs text-rose-700 leading-relaxed">
                {proposal.rejectionReason}
              </p>
            </div>
          )}

          {proposal.attachments && proposal.attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Attached Documents & Assets ({proposal.attachments.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {proposal.attachments.map((file, idx) => {
                  const fileUrl = file.secureUrl || "";
                  const fileName = file.publicId || "";
                  const isPdf = fileUrl.toLowerCase().endsWith(".pdf");

                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between"
                    >
                      {isPdf ? (
                        <div className="p-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            PDF
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {fileName}
                            </p>
                            <span className="text-[11px] text-slate-400">
                              PDF Document
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative group border-b border-slate-200 bg-slate-100 h-36 overflow-hidden flex items-center justify-center">
                          <img
                            src={fileUrl}
                            alt={fileName}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5"
                          >
                            <span>Preview Full Image</span>
                          </a>
                        </div>
                      )}

                      <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-medium text-slate-400 truncate max-w-[150px]">
                          {fileName}
                        </span>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-slate-700 hover:text-emerald-600 transition-colors flex items-center gap-1 text-[11px]"
                        >
                          {isPdf ? "Open PDF" : "View Direct"}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {showRejectInput && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Reason for Rejection (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Provide feedback or reasons for declining this proposal..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectInput(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleStatusChange("rejected")}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-sm"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-all"
          >
            Close
          </button>

          {!showRejectInput && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleChat}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm flex items-center gap-1.5"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>Chat with Contractor</span>
              </button>

              <button
                type="button"
                disabled={isRejected}
                onClick={() => setShowRejectInput(true)}
                className="px-4 py-2 rounded-lg text-xs font-bold border border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 disabled:opacity-40 transition-all"
              >
                Reject Proposal
              </button>

              <button
                type="button"
                disabled={isApproved}
                onClick={() => handleStatusChange("accepted")}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-all shadow-sm"
              >
                Approve Proposal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
