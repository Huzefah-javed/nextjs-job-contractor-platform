"use client";

import SetupMilestoneModal from "@/app/components/milestoneSetup";
import socket from "@/config/socket.config";
import { transactionCreationAction } from "@/serverActions/adminTransactionCreation";
import { readMsgAction } from "@/serverActions/clientSideChatActions";
import {
  MessageAction,
  MessageLoadAction,
  MessageOfferAcceptAction,
  MessageOfferDeclineAction,
} from "@/serverActions/messagesAction";
import { Check, Loader2, PlusCircle, Send } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ChatWindow({ active, setMessages, messages }) {
  const [inputText, setInputText] = useState("");
  const [projectMilestoneModalStatus, setProjectMilestoneModalStatus] =
    useState(false);

  useEffect(() => {
    async function fetchMsgs() {
      try {
        const res = await MessageLoadAction(active.chatId);
        if (res.success) setMessages(res.response);
      } catch (e) {
        console.log("error: ", e.message);
      }
    }
    fetchMsgs();
    return () => readMsgAction(active.chatId, active.clientId);
  }, [active]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    socket.emit("sendMsg", {
      roomId: active.roomId,
      chatId: active.chatId,
      messageType: "message",
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
    setInputText("");
  };

  const handleDeclineOffer = async (msgId, senderId) => {
    const response = await MessageOfferDeclineAction(msgId, senderId);
    if (response.success) {
    } else {
      console.log(response.message || "failed to decline");
    }
  };

  const handleAcceptOffer = async (milestones, msgId, senderId) => {
    try {
      const [response, response1] = await Promise.all([
        MessageOfferAcceptAction(msgId, senderId),
        transactionCreationAction({
          milestones,
          senderId,
          clientId: active.clientId,
          contractorId: active.contractorId,
          projectId: active.jobId,
          selectedProposalId: active.proposalId,
        }),
      ]);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
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
            {active?.status}
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
                {msg.messageType === "offer" ? (
                  <div className="max-w-[85%] sm:max-w-[70%] bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full">
                        Custom Offer
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Total: $
                        {msg.offerMessage
                          ?.reduce(
                            (sum, m) => sum + (parseFloat(m.amount) || 0),
                            0,
                          )
                          .toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Milestones ({msg.offerMessage?.length || 0})
                      </span>
                      {msg.offerMessage?.map((milestone, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 space-y-1.5"
                        >
                          <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                            <span>
                              {idx + 1}. {milestone.title.split("-")[0]}
                            </span>
                            <span className="text-emerald-600">
                              ${parseFloat(milestone.amount).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                            <span>Duration:</span>
                            <span>
                              {milestone.weeks || milestone.deadline} Weeks
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {msg.timestamp}
                        </span>
                        {isMe && (
                          <span>
                            {msg.isSending ? (
                              <Loader2 className="w-3 h-3 text-slate-400 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3 text-emerald-600" />
                            )}
                          </span>
                        )}
                      </div>
                      {msg.offerStatus === "decline" ? (
                        <div className="px-3.5 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold flex items-center gap-1.5">
                          <span>Offer Declined</span>
                        </div>
                      ) : msg.offerStatus === "accepted" ? (
                        <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5">
                          <span>Offer Accepted & Funded</span>
                        </div>
                      ) : (
                        !isMe && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleDeclineOffer &&
                                handleDeclineOffer(msg._id, msg.senderId)
                              }
                              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                            >
                              Decline
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleAcceptOffer(
                                  msg.offerMessage,
                                  msg._id,
                                  msg.senderId,
                                )
                              }
                              className="px-4 py-2 bg-[#11b017] hover:bg-[#0ea013] text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                            >
                              Accept & Fund
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? "bg-[#11b017] text-white rounded-br-xs font-normal"
                        : "bg-slate-100/80 text-slate-700 rounded-bl-xs font-normal"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <div
                      className={`flex items-center justify-end gap-1.5 text-[10px] mt-2 font-medium ${
                        isMe ? "text-emerald-100/80" : "text-slate-400"
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMe && (
                        <span>
                          {msg.isSending ? (
                            <Loader2 className="w-3 h-3 text-emerald-100 animate-spin" />
                          ) : (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )}
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
