"use client";

import React, { useEffect, useState } from "react";
import socket from "@/config/socket.config";
import ChatWindow from "./components/chatWindow";
import ChatSidebar from "./components/chatSider";
import { gettingChatsForClients } from "@/serverActions/clientSideChatActions";
import { authAndGetUser } from "@/helpers/authAndGetUser";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function joinRooms() {
      const res = await authAndGetUser();
      if (!res.success) return;

      console.log("client joining");
      socket.emit("joinAllRooms", { userId: res.id });
    }
    socket.on("connect", () => {
      console.log(`Connected to server with ID: ${socket.id}`);

      joinRooms();
    });
    if (socket.connected) joinRooms();
    return () => socket.off("connect");
  }, []);

  useEffect(() => {
    socket.on("receiveMsg", (data) => {
      console.log("Message received");
        setConversations((prev) =>
          prev.map((item) => {
            return item.roomId === data.roomId
              ? {
                  ...item,
                  unreadMessageCount: item.unreadMessageCount + 1,
                  lastMessage: data.message,
                }
              : item;
          }),
        );
        console.log(active);
        if (Object.keys(active).length > 0)
          setMessages((prev) => [...prev, data]);
    });
    return () => socket.off("receiveMsg");
  }, [active]);

  useEffect(() => {
    async function fetchData() {
      const result = await gettingChatsForClients();
      console.log(result);
      if (result.success) {
        const convos = result.response.map((convo) => {
          return {
            chatId: convo.chatId,
            roomId: convo.roomId,
            clientId: convo.clientId,
            contractorId: convo.contractor._id,
            contractorName: convo.contractor.name,
            lastMessage: convo.lastMessage,
            unreadMessageCount: convo.unreadMessageCount,
          };
        });

        setConversations(convos);
      }
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
          setActive={setActive}
        />

        <ChatWindow
          active={active}
          setMessages={setMessages}
          messages={messages}
        />
      </div>
    </div>
  );
}
