"use client";

import socket from "@/config/socket.config";
import {
  MessageAction,
  MessageLoadAction,
} from "@/serverActions/messagesAction";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function ChatWindow({ active }) {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMsg", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    console.log(messages);
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`Connected to server with ID: ${socket.id}`);
    });

    console.log("chitty", active.roomId);
    socket.emit("chat", active.roomId);
  }, [active?.roomId]);
  useEffect(() => {
    async function fetchMsgs() {
      const res = await MessageLoadAction(active.chatId);
      if (res.success) setMessages(res.response);
    }
    fetchMsgs();
  }, [active]);

  console.log(active);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      sender: "me",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("sendMsg", {
      roomId: active.roomId,
      message: inputText,
      senderId: active.contractorId,
    });
    await MessageAction(active?.chatId, inputText);

    setInputText("");

    console.log(messages);
  };

  if (!active) return null;
  return (
    <div className="flex-2 border border-slate-200/80 rounded-[2rem] bg-white p-6 shadow-sm flex flex-col justify-between ">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex justify-center items-center">
          {active?.userName?.slice(0, 1)}
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800 leading-tight">
            {active?.userName}
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {active?.status || "ONLINE"}
          </span>
        </div>
      </div>

      <div className="flex-1 py-6 overflow-y-auto space-y-5">
        {messages &&
          messages?.map((msg) => {
            console.log(" senderId ", msg.senderId);
            console.log(" clientId ", active.clientId);
            const isMe = msg.senderId === active.contractorId;

            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? "bg-[#11b017] text-white rounded-br-xs font-normal"
                      : "bg-slate-100/80 text-slate-700 rounded-bl-xs font-normal"
                  }`}
                >
                  <p>{msg.message}</p>
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

      <form onSubmit={handleSend} className="flex items-center gap-3 pt-2">
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="w-full py-3.5 pl-5 pr-12 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-300 text-slate-700 placeholder:text-slate-400 shadow-xs"
          />
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
