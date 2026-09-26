"use client";

import React from "react";
import { User, Briefcase, DollarSign, ExternalLink } from "lucide-react";
import { adminTransactionCreation } from "@/serverActions/adminTransactionCreation";

export default function PendingEscrowCard({ project, onCreateTransaction }) {
  const {
    projectId,
    projectTitle = "Untitled Project",
    clientName = "N/A",
    clientEmail = "",
    contractorName = "N/A",
    contractorEmail = "",
    amount = 0,
    selectedProposalId,
    milestones,
  } = project || {};

  const handleCreateTransaction = async () => {
    const result = await adminTransactionCreation({
      projectId,
      projectTitle,
      milestones,
      clientEmail,
      contractorEmail,
      selectedProposalId,
    });

    console.log(result);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-6">
      {/* Top Header: Title & Budget Badge */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[#16A34A]">{projectTitle}</h3>
          <p className="text-xs text-gray-400 font-mono">
            Project ID: {projectId}
          </p>
        </div>

        {/* Budget Pill */}
        <div className="bg-[#16A34A]/10 border border-[#16A34A]/20 text-[#16A34A] px-4 py-2 rounded-full text-sm font-bold shrink-0 self-start md:self-auto flex items-center gap-1">
          <DollarSign size={16} />
          <span>{amount?.toLocaleString()}</span>
          <span className="text-xs font-medium text-green-700 opacity-80">
            Pending Escrow
          </span>
        </div>
      </div>

      {/* Middle Grid: Client & Contractor Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 border border-gray-100 rounded-2xl p-4">
        {/* Client Info */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl shrink-0 shadow-2xs">
            <User size={18} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Client
            </span>
            <p className="text-sm font-bold text-gray-800 truncate">
              {clientName}
            </p>
            {clientEmail && (
              <p className="text-xs text-gray-500 truncate">{clientEmail}</p>
            )}
          </div>
        </div>

        {/* Contractor Info */}
        <div className="flex items-start gap-3 border-t sm:border-t-0 sm:border-l border-gray-200/60 pt-3 sm:pt-0 sm:pl-4">
          <div className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl shrink-0 shadow-2xs">
            <Briefcase size={18} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Contractor
            </span>
            <p className="text-sm font-bold text-gray-800 truncate">
              {contractorName}
            </p>
            {contractorEmail && (
              <p className="text-xs text-gray-500 truncate">
                {contractorEmail}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400 font-mono hidden sm:inline">
          Proposal:{" "}
          {selectedProposalId ? `${selectedProposalId.slice(0, 10)}...` : "N/A"}
        </span>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button className="bg-[#9CA3AF] hover:bg-gray-500 text-white px-5 py-2.5 rounded-full font-medium text-xs transition-colors cursor-pointer">
            View Details
          </button>

          <button
            onClick={() => handleCreateTransaction(project)}
            className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-semibold text-xs transition-all cursor-pointer shadow-sm flex items-center gap-2 shrink-0"
          >
            Create Transaction
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
