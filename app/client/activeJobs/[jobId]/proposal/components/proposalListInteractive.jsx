"use client";

import React, { useState } from "react";

export default function ProposalListInteractive({ initialProposals }) {
  const [proposals, setProposals] = useState(initialProposals);
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Sync state when modal approves/rejects
  const handleProposalStatusUpdated = (updatedId, newStatus, reason) => {
    setProposals((prev) =>
      prev.map((prop) =>
        prop.id === updatedId
          ? { ...prop, status: newStatus, rejectionReason: reason || null }
          : prop,
      ),
    );
  };

  if (proposals.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500 text-xs font-semibold">
        No proposals submitted for this job yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                <th className="py-3.5 px-5">Contractor</th>
                <th className="py-3.5 px-5">Proposed Budget</th>
                <th className="py-3.5 px-5">Duration</th>
                <th className="py-3.5 px-5">Submitted Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 text-xs">
              {proposals.map((proposal) => {
                const isApproved =
                  proposal.status.toLowerCase() === "approved" ||
                  proposal.status.toLowerCase() === "accepted";
                const isRejected = proposal.status.toLowerCase() === "rejected";

                return (
                  <tr
                    key={proposal.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Contractor Name & Email */}
                    <td className="py-4 px-5">
                      <div className="font-bold text-gray-900">
                        {proposal.contractorName}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {proposal.contractorEmail}
                      </div>
                    </td>

                    {/* Proposed Budget */}
                    <td className="py-4 px-5 font-bold text-gray-800">
                      ${proposal.proposedBudget?.toLocaleString()}
                    </td>

                    {/* Estimated Duration */}
                    <td className="py-4 px-5 text-gray-600 font-medium">
                      {proposal.estimatedDuration}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-gray-500">
                      {proposal.createdAt}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isApproved
                            ? "bg-green-50 text-[#16A34A] border-green-200"
                            : isRejected
                              ? "bg-red-50 text-red-600 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {proposal.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedProposal(proposal)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition-all text-xs"
                        >
                          View
                        </button>

                        {/* Approve Button */}
                        <button
                          type="button"
                          disabled={isApproved}
                          onClick={() =>
                            handleProposalStatusUpdated(proposal.id, "approved")
                          }
                          className="px-3 py-1.5 rounded-lg bg-[#16A34A] hover:bg-green-700 disabled:opacity-40 text-white font-bold transition-all text-xs shadow-sm"
                        >
                          Approve
                        </button>

                        {/* Reject Button */}
                        <button
                          type="button"
                          disabled={isRejected}
                          onClick={() =>
                            handleProposalStatusUpdated(proposal.id, "rejected")
                          }
                          className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 disabled:opacity-40 text-red-600 font-bold transition-all text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {/* <ProposalDetailModal
        proposal={selectedProposal}
        isOpen={!!selectedProposal}
        onClose={() => setSelectedProposal(null)}
        onStatusUpdated={handleProposalStatusUpdated}
      /> */}
    </div>
  );
}
