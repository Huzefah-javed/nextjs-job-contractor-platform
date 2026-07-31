"use client";

import React from "react";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[#1E1E1E]/90 border border-gray-800 rounded-2xl p-6 flex flex-col items-center gap-3 shadow-xl">
        {/* Simple Green Spinner */}
        <div className="w-10 h-10 border-3 border-gray-700 border-t-[#16A34A] rounded-full animate-spin" />

        {/* Simple Text */}
        <p className="text-xs font-bold text-gray-200 tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
}
