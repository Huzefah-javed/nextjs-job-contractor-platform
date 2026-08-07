"use client";

import React, { useState } from "react";

export default function ChatWindow({ activeUser, messages, onSendMessage }) {
  const [inputText, setInputText] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  if (!activeUser) return null;

  return (
    <div className="flex-2 border border-slate-200/80 rounded-[2rem] bg-white p-6 shadow-sm flex flex-col justify-between ">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
          <img
            src={activeUser.avatar}
            alt={activeUser.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800 leading-tight">
            {activeUser.name}
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {activeUser.status || "ONLINE"}
          </span>
        </div>
      </div>

      {/* 2. Messages Container */}
      <div className="flex-1 py-6 overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isMe = msg.sender === "me";

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? "bg-[#11b017] text-white rounded-br-xs font-normal"
                    : "bg-slate-100/80 text-slate-700 rounded-bl-xs font-normal"
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`block text-[10px] mt-2 font-medium ${
                    isMe ? "text-emerald-100/80 text-right" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Message Input Bar */}
      <form onSubmit={handleSend} className="flex items-center gap-3 pt-2">
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="w-full py-3.5 pl-5 pr-12 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-300 text-slate-700 placeholder:text-slate-400 shadow-xs"
          />
          {/* Image Upload Icon */}
          <button
            type="button"
            className="absolute right-4 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="px-6 py-3.5 bg-[#11b017] hover:bg-[#0ea013] text-white rounded-2xl text-xs font-bold transition-all shadow-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
}
