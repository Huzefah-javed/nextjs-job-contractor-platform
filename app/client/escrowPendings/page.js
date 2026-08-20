"use client";

import React, { useEffect, useState, useTransition } from "react";
import { getClientPendingEscrowJobs } from "@/serverActions/clientEscrowActions";
import LoadingSpinner from "@/app/loading";

export default function ClientEscrowPendingPage() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = () => {
    setIsLoading(true);
    setError(null);
    startTransition(async () => {
      const res = await getClientPendingEscrowJobs();
      if (res.success) {
        setJobs(res.data || []);
      } else {
        setError(res.message);
      }
      setIsLoading(false);
    });
  };

  const handlePayEscrow = (transactionId) => {
    if (!transactionId) {
      alert("Transaction ID is missing for this job. Please contact support.");
      return;
    }
    const paymentUrl = `https://www.escrow-sandbox.com/transactions/${transactionId}/payment`;
    window.location.href = paymentUrl;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Pending Escrow Payments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deposit funds into Escrow to activate your approved jobs.
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium">
          Pending:{" "}
          <span className="text-[#11b017] font-bold">{jobs.length}</span>
        </div>
      </div>

      {(isLoading || isPending) && (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
          <LoadingSpinner />
          <p className="text-xs text-slate-500 font-medium">
            Loading pending escrow payments...
          </p>
        </div>
      )}

      {!isLoading && error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex justify-between items-center">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchPendingJobs}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 bg-white border border-dashed border-slate-200 rounded-2xl text-center space-y-1">
          <p className="text-sm font-semibold text-slate-800">
            No pending escrow payments
          </p>
          <p className="text-xs text-slate-500">
            Jobs requiring Escrow funding will appear here once approved.
          </p>
        </div>
      )}

      {!isLoading && !error && jobs.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Job Details</th>
                  <th className="py-3.5 px-5">Contractor</th>
                  <th className="py-3.5 px-5">Budget</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Escrow Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {jobs.map((item) => {
                  const proposal = item.selectedProposalId || {};
                  const contractor = proposal.contractorId || {};
                  const budget = proposal.proposedBudget || item.budget || 0;

                  const dateStr = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Job Title & Preview */}
                      <td className="py-4 px-5 max-w-xs">
                        <h2 className="font-bold text-slate-900 text-xs truncate">
                          {item.projectTitle.slice(0,10) + "..." || "Untitled Job"}
                        </h2>
                      </td>

                      {/* Contractor Name */}
                      <td className="py-4 px-5 font-semibold text-slate-700 whitespace-nowrap">
                        {contractor.name || "Contractor"}
                      </td>

                      {/* Proposed Budget */}
                      <td className="py-4 px-5 font-black text-[#11b017] whitespace-nowrap">
                        ${budget.toLocaleString()}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 text-slate-500 whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* Escrow Status Badge */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Funding Pending
                        </span>
                      </td>

                      {/* Action CTA */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handlePayEscrow(item.transactionId)}
                          className="px-4 py-2 bg-[#11b017] hover:bg-[#0ea013] text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          Fund Escrow
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
