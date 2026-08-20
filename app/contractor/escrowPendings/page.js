"use client";

import LoadingSpinner from "@/app/loading";
import { getPendingTermsProposals } from "@/serverActions/contractorProposalActions";
import React, { useEffect, useState, useTransition } from "react";

export default function PendingTermsProposalsPage() {
  const [proposals, setProposals] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = () => {
    setIsLoading(true);
    setError(null);
    startTransition(async () => {
      const res = await getPendingTermsProposals();
      if (res.success) {
        setProposals(res.data || []);
      } else {
        setError(res.message);
      }
      setIsLoading(false);
    });
  };

  const handleAgreeToTerms = (url) => {
    if (!url) return;
    window.location.href = url;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Pending Term Agreements
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Accept Escrow terms to activate your selected proposals.
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium">
          Pending:{" "}
          <span className="text-[#11b017] font-bold">{proposals.length}</span>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading && <LoadingSpinner />}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Job Details</th>
                <th className="py-3.5 px-5">Client</th>
                <th className="py-3.5 px-5">Budget</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {proposals.map((item) => {
                const job = item.jobId || {};
                const client = job.clientId || {};
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
                    <td className="py-4 px-5 max-w-xs">
                      <h2 className="font-bold text-slate-900 text-xs truncate">
                        {job.projectTitle.slice(0, 10) + "..." ||
                          "Untitled Job"}
                      </h2>
                    </td>

                    {/* Client Name */}
                    <td className="py-4 px-5 font-semibold text-slate-700 whitespace-nowrap">
                      {client.name || "Client"}
                    </td>

                    {/* Proposed Budget */}
                    <td className="py-4 px-5 font-black text-[#11b017] whitespace-nowrap">
                      ${item.proposedBudget?.toLocaleString() || "0"}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-slate-500 whitespace-nowrap">
                      {dateStr}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Awaiting Agreement
                      </span>
                    </td>

                    {/* Action CTA */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleAgreeToTerms(item.nextUrl)}
                        className="px-4 py-2 bg-[#11b017] hover:bg-[#0ea013] text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
                      >
                        Agree to Terms
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
