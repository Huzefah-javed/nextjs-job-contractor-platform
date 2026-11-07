"use client";

import React, { useEffect, useState } from "react";
import socket from "@/config/socket.config";
import ChatWindow from "./components/chatWindow";
import ChatSidebar from "./components/chatSider";
import { gettingChatsForClients } from "@/serverActions/clientSideChatActions";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import { useSearchParams } from "next/navigation";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState({});
  const [messages, setMessages] = useState([]);

  const params = useSearchParams();
  const chaIdQuery = params.get("chatId");

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
    socket.on("receiveMsg", async (data) => {
      const res = await authAndGetUser();
      if (!res.success) return;

      if (data.senderId === res.id) {
        setMessages((prev) =>
          prev.map((chat) => {
            if (chat.isSending && chat.isSending === true) {
              return { ...chat, isSending: false };
            } else {
              return chat;
            }
          }),
        );
      } else {
        console.log("Message received", data);

        let convo = conversations.filter(
          (item) => item.roomId === data.roomId,
        )[0];

        const fil = conversations.filter((item) => item.roomId !== data.roomId);
        convo.lastMessage = data.message;
        setConversations([convo, ...fil]);
        if (Object.keys(active).length > 0 && active.roomId === data.roomId) {
          setMessages((prev) => [...prev, data]);
        } else {
          convo.unreadMessageCount = convo.unreadMessageCount + 1;
        }
      }
    });
    return () => socket.off("receiveMsg");
  }, [active, conversations]);

  useEffect(() => {
    socket.on("onlineUserDetected", (roomId) => {
      const isThere = conversations.find(
        (convo) => convo.roomId === roomId && convo.status === "online",
      );
      if (!isThere) {
        setConversations((prev) =>
          prev.map((convo) =>
            convo.roomId === roomId ? { ...convo, status: "online" } : convo,
          ),
        );
      }
      socket.emit("onlineStatusSend", roomId);
    });

    socket.on("onlineStatusReceive", (roomId) => {
      const isThere = conversations.find(
        (convo) => convo.roomId === roomId && convo.status === "online",
      );
      if (!isThere) {
        setConversations((prev) =>
          prev.map((convo) =>
            convo.roomId === roomId ? { ...convo, status: "online" } : convo,
          ),
        );
      }
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      const result = await gettingChatsForClients();
      if (result.success) {
        const roomIds = result.response.map((convo) => convo.roomId);
        socket.emit("OnlineNotifyToAll", roomIds);
        const convos = result.response.map((convo) => {
          let obj = {
            chatId: convo.chatId,
            roomId: convo.roomId,
            clientId: convo.clientId,
            contractorId: convo.contractor._id,
            contractorName: convo.contractor.name,
            lastMessage: convo.lastMessage,
            unreadMessageCount: convo?.unreadMessageCount || 0,
            status: "offline",
          };
          if (chaIdQuery && chaIdQuery === obj.chatId) setActive(obj);
          return obj;
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
          setConversations={setConversations}
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
