"use client";

import React from "react";
import Image from "next/image";

export default function ContractorProfileCard() {
  // Chart heights representing the bars in the image without month labels or values
  const chartBars = [
    { heightClass: "h-10" },
    { heightClass: "h-[70px]" },
    { heightClass: "h-24" },
    { heightClass: "h-[110px]" },
    { heightClass: "h-24" },
  ];

  return (
    <div className="flex-[25%] h-screen sticky top-0 bg-white border border-gray-100 p-6 shadow-sm font-sans flex flex-col items-center text-center">
      <span className="text-gray-700 text-sm font-semibold tracking-wide mb-6">
        Your Profile
      </span>

      <div className="relative w-28 h-28 flex items-center justify-center mb-5">
        <div className="absolute inset-0 rounded-full border-[6px] border-gray-100" />

        <div className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-[#22C55E] border-r-[#22C55E] border-b-[#22C55E] rotate-[15deg] pointer-events-none" />

        <div className="relative w-[90px] h-[90px] rounded-full overflow-hidden border-[3px] border-white bg-amber-500 shadow-sm z-10">
          <Image
            src="/profile-john.jpg"
            alt="John"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Greeting */}
      <h2 className="text-gray-800 text-base font-bold mb-2">
        Good Morning John
      </h2>

      {/* Subtext */}
      <p className="text-gray-400 text-[11px] font-semibold leading-relaxed max-w-[210px] mb-6">
        Continue Your Journey And Achieve Your Target
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-10">
        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      {/* Chart Section */}
      <div className="w-full flex justify-between items-end px-4 min-h-[120px]">
        {chartBars.map((bar, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className={`w-6 ${bar.heightClass} rounded-md bg-gradient-to-t from-[#15803d] via-[#22c55e] to-[#86efac]`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
