"use client";

import SetupMilestoneModal from "@/app/components/milestoneSetup";
import socket from "@/config/socket.config";
import { readMsgAction } from "@/serverActions/clientSideChatActions";
import {
  MessageAction,
  MessageLoadAction,
} from "@/serverActions/messagesAction";
import { PlusCircle, Send } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ChatWindow({ active, setMessages, messages }) {
  const [inputText, setInputText] = useState("");
  const [projectMilestoneModalStatus, setProjectMilestoneModalStatus] =
    useState(false);

  useEffect(() => {
    async function fetchMsgs() {
      const res = await MessageLoadAction(active.chatId);
      if (res.success) setMessages(res.response);
    }
    fetchMsgs();
    return () => readMsgAction(active.chatId, active.clientId);
  }, [active]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    socket.emit("sendMsg", {
      roomId: active.roomId,
      message: inputText,
      senderId: active.clientId,
    });
    setMessages((prev) => [
      ...prev,
      {
        roomId: active.roomId,
        message: inputText,
        senderId: active.clientId,
      },
    ]);
    await MessageAction(active?.chatId, inputText);
    setInputText("");
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
            {active?.contractorName}
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {active?.status || "ONLINE"}
          </span>
        </div>
      </div>

      <div className="flex-1 py-6 overflow-y-auto space-y-5">
        {messages &&
          messages?.map((msg) => {
            const isMe = msg.senderId === active.clientId;

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

      <form onSubmit={handleSend} className="flex items-center gap-2 pt-2">
        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-3.5 bg-green-50 hover:bg-green-100 text-[#16A34A] border border-green-200/80 rounded-2xl text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
          title="Create a Custom Offer"
          onClick={() => setProjectMilestoneModalStatus(true)}
        >
          <PlusCircle size={16} />
          <span className="hidden sm:inline">Create Offer</span>
        </button>

        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="w-full py-3.5 pl-5 pr-12 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-300 text-slate-700 placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3.5 bg-[#16A34A] hover:bg-green-700 text-white rounded-2xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Send</span>
          <Send size={14} className="hidden sm:inline" />
        </button>
      </form>

      {projectMilestoneModalStatus && active && active?.roomId && (
        <SetupMilestoneModal
          onClose={() => setProjectMilestoneModalStatus(false)}
          roomId={active.roomId}
          clientId={active.clientId}
          chatId={active.chatId}
          setMessages={setMessages}
          offerMadeBy={"client"}
        />
      )}
    </div>
  );
}
