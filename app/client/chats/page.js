"use client";

import React, { useEffect, useState } from "react";
import ChatWindow from "./components/chatWindow";
import ChatSidebar from "./components/chatSider";
import { gettingChatsForClients } from "@/serverActions/clientSideChatActions";

const INITIAL_CONVERSATIONS = [
  {
    id: "1",
    name: "Daniel Brooks",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150",
    status: "ONLINE",
    lastMessage: "Revised structural drawings uploaded for approval.",
  },
  {
    id: "2",
    name: "Sarah Martinez",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    status: "ONLINE",
    lastMessage: "Inspection clearance confirmed for Phase 1.",
  },
  {
    id: "3",
    name: "Kevin O'Neil",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    status: "OFFLINE",
    lastMessage: "Milestone payment successfully processed.",
  },
  {
    id: "4",
    name: "Michael Turner",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    status: "ONLINE",
    lastMessage: "Updated cost breakdown and BOQ attached.",
  },
  {
    id: "5",
    name: "Anthony Ramirez",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    status: "OFFLINE",
    lastMessage: "Final blueprint revisions submitted for review.",
  },
];

const INITIAL_MESSAGES = {
  1: [
    {
      id: "m1",
      sender: "them",
      text: "Hi, could you confirm the updated milestone schedule for the renovation phase? We would like to align internal approvals accordingly.",
      timestamp: "10:05 AM",
    },
    {
      id: "m2",
      sender: "me",
      text: "Certainly. Structural work will conclude by Wednesday, followed by inspection clearance on Thursday. I will share documentation immediately after approval.",
      timestamp: "10:12 AM",
    },
    {
      id: "m3",
      sender: "them",
      text: "Thank you. Please proceed with milestone release once inspection is completed.",
      timestamp: "10:18 AM",
    },
  ],
};

export default function MessagesPage() {
  const [conversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState("1");
  const [messagesMap, setMessagesMap] = useState(INITIAL_MESSAGES);

  const activeUser = conversations.find((c) => c.id === activeId);
  const activeMessages = messagesMap[activeId] || [];

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: "me",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMessage],
    }));
  };

  useEffect(async() => {
    async function doSomething() {
      return await gettingChatsForClients();
    }
    const result = await doSomething();
    console.log(result);
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
          activeId={activeId}
          onSelect={setActiveId}
        />

        <ChatWindow
          activeUser={activeUser}
          messages={activeMessages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}
