"use client";

import React from "react";

export default function ChatSidebar({ conversations, activeId, onSelect }) {
  return (
    <div className=" border border-slate-200/80 rounded-[2rem] bg-white p-5 shadow-sm flex flex-col gap-4">
      <h2 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-1">
        Active Escrow Milestones
      </h2>

      <div className="space-y-2.5 overflow-y-auto max-h-[600px] pr-1">
        {conversations.map((item) => {
          const isActive = item.ChatId === activeId;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                isActive
                  ? "border-emerald-500 bg-slate-50/80 shadow-sm ring-1 ring-emerald-500/20"
                  : "border-slate-200/80 bg-white hover:bg-slate-50/60"
              }`}
            >
              <div className="relative w-10 h-10 font-bold text-2xl flex justify-center items-center rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                {item?.clientName?.slice(0, 1)}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {item.clientName}
                </h3>
                <p className="text-[11px] text-slate-500 truncate mt-0.5 leading-tight">
                  {item?.lastMessage.slice(0, 15) + "..." ||
                    "start conversation"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
