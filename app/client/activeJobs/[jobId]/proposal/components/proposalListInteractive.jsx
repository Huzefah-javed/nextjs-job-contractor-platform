"use client";

import React, { useTransition, useEffect, useState } from "react";
import ProposalDetailModal from "./ProposalDetailModal";
import { updateProposalStatusAction } from "@/serverActions/proposalAction";
import LoadingSpinner from "@/app/loading";
import { useRouter } from "next/navigation";

export default function ProposalListInteractive({ initialProposals, jobId }) {
  const [proposals, setProposals] = useState(initialProposals);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setProposals(initialProposals);
  }, [initialProposals]);

  const router = useRouter();

  const handleStatusChange = (proposal, newStatus) => {
    startTransition(async () => {
      try {
        const res = await updateProposalStatusAction({
          proposalId: proposal.id || proposal._id,
          contractorId: proposal.contractorId,
          rejectionReason: proposal.rejectionReason || "",
          status: newStatus,
          jobId,
        });

        if (res?.success) {
          // notify user about success
        } else {
          console.log(res);
        }
      } catch (err) {
        console.log(err);
      }
    });
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
      {isPending && <LoadingSpinner />}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
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
                    <td className="py-4 px-5">
                      <div className="font-bold text-gray-900">
                        {proposal.contractorName}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {proposal.contractorEmail}
                      </div>
                    </td>

                    <td className="py-4 px-5 font-bold text-gray-800">
                      ${proposal.proposedBudget?.toLocaleString()}
                    </td>

                    <td className="py-4 px-5 text-gray-600 font-medium">
                      {proposal.estimatedDuration}
                    </td>

                    <td className="py-4 px-5 text-gray-500">
                      {proposal.createdAt}
                    </td>

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

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedProposal(proposal)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition-all text-xs"
                        >
                          View
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

      <ProposalDetailModal
        proposal={selectedProposal}
        jobId={jobId}
        isOpen={!!selectedProposal}
        onClose={() => setSelectedProposal(null)}
        statusUpdated={handleStatusChange}
      />
    </div>
  );
}
