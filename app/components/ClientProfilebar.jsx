"use client";

import React from "react";
import Image from "next/image";

export default function ClientProfileCard() {
  const chartData = [
    { month: "Jan", value: "$12k", heightClass: "h-12" },
    { month: "Feb", value: "$18k", heightClass: "h-[72px]" },
    { month: "Mar", value: "$9k", heightClass: "h-9" },
    { month: "Apr", value: "$22k", heightClass: "h-[88px]" },
    { month: "May", value: "$16k", heightClass: "h-16" },
  ];

  return (
    <div className="flex-[25%] h-screen sticky top-0 bg-white border border-gray-100 p-6 shadow-sm font-sans flex flex-col items-center text-center">
      <span className="text-gray-700 text-sm font-semibold tracking-wide mb-6">
        Your Profile
      </span>

      <div className="relative w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-[#22C55E] to-[#22C55E] flex items-center justify-center mb-5 shadow-sm">
        <div className="relative w-full h-full rounded-full overflow-hidden border-[3px] border-white bg-orange-500">
          <Image
            src="/profile-olivia.jpg"
            alt="Olivia"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <h2 className="text-gray-800 text-base font-bold mb-2">
        Good Afternoon, Olivia
      </h2>

      <p className="text-gray-400 text-[11px] font-semibold leading-relaxed max-w-[210px] mb-6">
        Manage Your Projects, Review Proposals, And Release Payments Securely.
      </p>

      <div className="flex items-center gap-3 mb-8">
        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors">
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

        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors">
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

      <div className="w-full flex justify-between items-end px-2 pt-4 border-t border-gray-50">
        {chartData.map((data, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <span className="text-[10px] font-bold text-gray-300">
              {data.value}
            </span>
            <div
              className={`w-6 ${data.heightClass} rounded-md relative overflow-hidden bg-gradient-to-t from-[#15803d] via-[#22c55e] to-[#86efac]`}
            ></div>
            <span className="text-[10px] font-bold text-gray-300">
              {data.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
