"use client";

import React from "react";

export default function ContractorDashboardJohn() {
  return (
    <div className="space-y-6 p-8 bg-[#FAFAFA] min-h-screen font-sans text-gray-800">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-300">Welcome back, John</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Active Projects
          </div>
          <div className="text-lg font-bold text-gray-800">3</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Pending Proposals
          </div>
          <div className="text-lg font-bold text-gray-800">5</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Escrow Balance
          </div>
          <div className="text-lg font-bold text-gray-800">$4,250</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Total Earnings
          </div>
          <div className="text-lg font-bold text-gray-800">$18,900</div>
        </div>
      </div>

      {/* Active Projects Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        {/* Sparkle background element */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
          <svg
            className="w-48 h-48 text-gray-900"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
          </svg>
        </div>

        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">
          Active Projects
        </h2>

        <div className="divide-y divide-gray-100">
          {/* Project 1 */}
          <div className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#22C55E]">
                Commercial Renovation – Los Angeles
              </h3>
              <p className="text-xs font-semibold text-gray-400">
                Milestone 2 in progress
              </p>
            </div>
            <span className="inline-block px-5 py-2 bg-[#22C55E] text-white rounded-full text-xs font-bold text-center sm:min-w-[160px]">
              $2,500 in escrow
            </span>
          </div>

          {/* Project 2 */}
          <div className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#22C55E]">
                Electrical Installation – San Diego
              </h3>
              <p className="text-xs font-semibold text-gray-400">
                Awaiting client approval
              </p>
            </div>
            <span className="inline-block px-5 py-2 bg-[#22C55E] text-white rounded-full text-xs font-bold text-center sm:min-w-[160px]">
              $1,200 pending
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">
          Recent Activity
        </h2>

        <ul className="space-y-3.5 text-xs font-semibold text-gray-500">
          <li className="flex items-start gap-2.5">
            <span className="text-gray-400 flex-shrink-0">✓</span>
            <span>
              Proposal submitted for{" "}
              <span className="text-[#22C55E]">
                “Warehouse Buildout Project”
              </span>
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-gray-400 flex-shrink-0">✓</span>
            <span>
              Milestone approved for{" "}
              <span className="text-[#22C55E]">“Office Interior Upgrade”</span>
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-gray-400 flex-shrink-0">✓</span>
            <span>New message from Prime Construction Group</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
