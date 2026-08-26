"use client";

import React from "react";

export default function ChatSidebar({ conversations, activeId, setActive }) {
  return (
    <div className=" border border-slate-200/80 rounded-[2rem] bg-white p-5 shadow-sm flex flex-col gap-4">
      <h2 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-1">
        Active Escrow Milestones
      </h2>

      <div className="space-y-2.5 overflow-y-auto max-h-[600px] pr-1">
        {conversations.map((item) => {
          const isActive = item.ChatId === activeId;
          const unreadCount = Number(item?.unreadMsgCount) || 0;

          return (
            <button
              key={item.id}
              onClick={() => setActive(item)}
              className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                isActive
                  ? "border-emerald-500 bg-slate-50/80 shadow-sm ring-1 ring-emerald-500/20"
                  : "border-slate-200/80 bg-white hover:bg-slate-50/60"
              }`}
            >
              {/* Avatar Container */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 font-bold text-lg text-slate-700 flex justify-center items-center rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                  {item?.clientName?.slice(0, 1)?.toUpperCase() || "C"}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-slate-800 truncate leading-tight">
                    {item?.clientName}
                  </h3>
                </div>

                <p
                  className={`text-[11px] truncate mt-0.5 leading-tight ${
                    unreadCount > 0
                      ? "font-semibold text-slate-900"
                      : "text-slate-500"
                  }`}
                >
                  {item?.lastMessage
                    ? item.lastMessage.length > 15
                      ? item.lastMessage.slice(0, 15) + "..."
                      : item.lastMessage
                    : "start conversation"}
                </p>
              </div>

              {unreadCount > 0 && (
                <div className="shrink-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold tracking-tight shadow-sm">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
