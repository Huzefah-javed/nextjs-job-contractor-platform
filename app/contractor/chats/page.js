"use client";

import React, { useEffect, useState } from "react";
import ChatWindow from "./components/chatWindow";
import ChatSidebar from "./components/chatSider";
import { gettingChatsForContractors } from "@/serverActions/contractorSideChatActions";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState({});

  useEffect(() => {
    async function fetchData() {
      const result = await gettingChatsForContractors();
      if (result.success) {
        const convos = result.response.map((convo) => {
          return {
            chatId: convo._id,
            roomId: convo.roomId,
            contractorId: convo.contractorId,
            clientName: convo.client.name,
            clientId: convo.client.id,
            lastMessage: convo.lastMessage || "start conversation",
          };
        });

        setConversations(convos);
      }
      console.log(result.response);
    }
    fetchData();
  }, []);

  return (
    <div className="w-full mx-auto p-6 md:p-5 font-sans space-y-6 bg-slate-50/30 h-[80%]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Messages
          </h1>
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mt-1">
            YOU HAVE 6 UNREAD MESSAGES.
          </p>
        </div>

        <button
          type="button"
          className="px-6 py-2.5 bg-[#11b017] hover:bg-[#0ea013] text-white font-bold text-xs rounded-2xl transition-all shadow-sm"
        >
          Open Inbox
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 w-full min-h-screen max-h-screen">
        <ChatSidebar
          conversations={conversations}
          activeId={active.chatId}
          onSelect={setActive}
        />

        <ChatWindow active={active} />
      </div>
    </div>
  );
}
