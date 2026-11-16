import React from "react";

export default function EscrowSummaryStats({ stats = [] }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-[16px] py-5 px-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#F2F2F2]"
        >
          <p className="text-[12px] text-[#7A7A7A] font-medium mb-1.5">
            {stat.label}
          </p>
          <p className="text-[15px] font-bold text-[#1E1E1E]">{stat.value}</p>
        </div>
      ))}
    </section>
  );
}
