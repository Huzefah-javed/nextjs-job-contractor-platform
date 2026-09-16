"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Wallet,
  Layers,
  Clock,
} from "lucide-react";
import { setupProjectMilestones } from "@/serverActions/setupProjectMilestones";

export default function SetupMilestoneModal({
  onClose,
  onSubmit,
  projectId,
  proposalPrice,
  projectDuration,
}) {
  const [paymentMode, setPaymentMode] = useState("milestones");

  const [milestones, setMilestones] = useState([
    {
      id: crypto.randomUUID(),
      title: "",
      amount: "",
      weeks: "",
      description: "",
    },
  ]);

  const parsedDuration = parseFloat(projectDuration) || 0;
  const parsedPrice = parseFloat(proposalPrice) || 0;

  const totalAllocatedAmount = milestones.reduce(
    (sum, m) => sum + (parseFloat(m.amount) || 0),
    0,
  );
  const remainingAmount = parsedPrice - totalAllocatedAmount;
  const isAmountExact = totalAllocatedAmount === parsedPrice;
  const isAmountExceeded = totalAllocatedAmount > parsedPrice;

  const totalAllocatedWeeks = milestones.reduce(
    (sum, m) => sum + (parseFloat(m.weeks) || 0),
    0,
  );
  const remainingWeeks = parsedDuration - totalAllocatedWeeks;

  const isTimeValid =
    totalAllocatedWeeks > 0 && totalAllocatedWeeks <= parsedDuration;
  const isTimeExceeded = totalAllocatedWeeks > parsedDuration;

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      {
        id: crypto.randomUUID(),
        title: "",
        amount: "",
        weeks: "",
        description: "",
      },
    ]);
  };

  const handleRemoveMilestone = (idToRemove) => {
    setMilestones(milestones.filter((m) => m.id !== idToRemove));
  };

  const handleChange = (id, field, value) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMode === "single") {
      const singleMilestone = [
        {
          title: "Full Project Delivery",
          amount: parsedPrice,
          weeks: parsedDuration,
          description:
            "Complete delivery of all project requirements as agreed in the proposal.",
        },
      ];
      const res = await setupProjectMilestones(projectId, singleMilestone);
      console.log(res);
      return;
    }

    if (!isAmountExact || !isTimeValid) return;

    const cleanMilestonesForDb = milestones.map(({ id, ...rest }) => ({
      ...rest,
      amount: parseFloat(rest.amount),
      weeks: parseFloat(rest.weeks),
    }));

    const res = await setupProjectMilestones(projectId, cleanMilestonesForDb);
    console.log(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Payment & Timeline Structure
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              How would you like to structure this project?
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Payment Mode Selector */}
        <div className="px-6 py-4 flex gap-4 border-b border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={() => setPaymentMode("milestones")}
            className={`flex-1 p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
              paymentMode === "milestones"
                ? "border-[#16A34A] bg-[#16A34A]/5 ring-1 ring-[#16A34A]"
                : "border-gray-200 bg-white hover:border-[#16A34A]/50"
            }`}
          >
            <Layers
              className={`shrink-0 mt-0.5 ${paymentMode === "milestones" ? "text-[#16A34A]" : "text-gray-400"}`}
              size={20}
            />
            <div>
              <div className="font-semibold text-sm text-gray-900">
                By Milestones
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Divide the project into smaller phases.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode("single")}
            className={`flex-1 p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
              paymentMode === "single"
                ? "border-[#16A34A] bg-[#16A34A]/5 ring-1 ring-[#16A34A]"
                : "border-gray-200 bg-white hover:border-[#16A34A]/50"
            }`}
          >
            <Wallet
              className={`shrink-0 mt-0.5 ${paymentMode === "single" ? "text-[#16A34A]" : "text-gray-400"}`}
              size={20}
            />
            <div>
              <div className="font-semibold text-sm text-gray-900">
                Entire Project
              </div>
              <div className="text-xs text-gray-500 mt-1">
                One payment at the end of {parsedDuration} weeks.
              </div>
            </div>
          </button>
        </div>

        {/* CONDITIONAL RENDER: IF MILESTONES SELECTED */}
        {paymentMode === "milestones" && (
          <>
            {/* Dynamic Trackers */}
            <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b bg-gray-50/80">
              {/* Budget Tracker */}
              <div
                className={`flex flex-col gap-1.5 p-3 rounded-lg border ${isAmountExact ? "bg-[#16A34A]/10 border-[#16A34A]/20" : isAmountExceeded ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}
              >
                <div className="flex justify-between text-xs font-semibold text-gray-500">
                  <span>Total Budget</span>
                  <span>${parsedPrice.toLocaleString()}</span>
                </div>
                <div
                  className={`flex items-center justify-between text-sm font-bold ${isAmountExact ? "text-[#16A34A]" : isAmountExceeded ? "text-red-600" : "text-gray-800"}`}
                >
                  <div className="flex items-center gap-1.5">
                    {isAmountExact ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    {isAmountExact
                      ? "Perfectly Allocated"
                      : isAmountExceeded
                        ? "Budget Exceeded"
                        : "Needs Allocation"}
                  </div>
                  <span>
                    {isAmountExact
                      ? "$0"
                      : `$${Math.abs(remainingAmount).toLocaleString()}`}{" "}
                    {isAmountExceeded ? "Over" : "Left"}
                  </span>
                </div>
              </div>

              {/* Timeline Tracker */}
              <div
                className={`flex flex-col gap-1.5 p-3 rounded-lg border ${isTimeValid ? "bg-[#16A34A]/10 border-[#16A34A]/20" : isTimeExceeded ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}
              >
                <div className="flex justify-between text-xs font-semibold text-gray-500">
                  <span>Max Timeline</span>
                  <span>{parsedDuration} Weeks</span>
                </div>
                <div
                  className={`flex items-center justify-between text-sm font-bold ${isTimeValid ? "text-[#16A34A]" : isTimeExceeded ? "text-red-600" : "text-gray-800"}`}
                >
                  <div className="flex items-center gap-1.5">
                    {isTimeValid ? (
                      <CheckCircle2 size={16} />
                    ) : isTimeExceeded ? (
                      <AlertCircle size={16} />
                    ) : (
                      <Clock size={16} />
                    )}
                    {isTimeExceeded
                      ? "Timeline Exceeded"
                      : isTimeValid
                        ? "Timeline Valid"
                        : "Allocating Time"}
                  </div>
                  <span>
                    {totalAllocatedWeeks} / {parsedDuration} Wks
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 space-y-6">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800">
                      Milestone {index + 1}
                    </h3>
                    {milestones.length > 1 && (
                      <button
                        onClick={() => handleRemoveMilestone(milestone.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Milestone Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Wireframing & Design"
                        value={milestone.title}
                        onChange={(e) =>
                          handleChange(milestone.id, "title", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Amount ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="0"
                          min="1"
                          step="any"
                          value={milestone.amount}
                          onChange={(e) =>
                            handleChange(milestone.id, "amount", e.target.value)
                          }
                          className={`w-full border rounded-lg pl-7 pr-3 py-2 text-sm outline-none ${isAmountExceeded ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-[#16A34A] focus:border-[#16A34A]"}`}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Duration (Weeks)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0"
                          min="0.5"
                          step="0.5"
                          value={milestone.weeks}
                          onChange={(e) =>
                            handleChange(milestone.id, "weeks", e.target.value)
                          }
                          className={`w-full border rounded-lg px-3 py-2 text-sm outline-none ${isTimeExceeded ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-[#16A34A] focus:border-[#16A34A]"}`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe what will be delivered in this milestone..."
                      rows="2"
                      value={milestone.description}
                      onChange={(e) =>
                        handleChange(
                          milestone.id,
                          "description",
                          e.target.value,
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] outline-none resize-none"
                      required
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddMilestone}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl py-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                <Plus size={18} /> Add Another Milestone
              </button>
            </div>
          </>
        )}

        {/* CONDITIONAL RENDER: IF SINGLE PAYMENT SELECTED */}
        {paymentMode === "single" && (
          <div className="p-2 flex-1 bg-gray-50/50 flex flex-col items-center justify-center text-center">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm max-w-sm">
              <div className="w-12 h-12 bg-[#16A34A]/10 text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Single Delivery
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                You will deliver the project in{" "}
                <strong>{parsedDuration} weeks</strong> for the full amount of{" "}
                <strong>${parsedPrice.toLocaleString()}</strong>.
              </p>
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                The client will fund the total amount into escrow to begin the
                contract.
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={
              paymentMode === "milestones" && (!isAmountExact || !isTimeValid)
            }
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all ${
              paymentMode === "single" || (isAmountExact && isTimeValid)
                ? "bg-[#16A34A] hover:bg-green-700 text-white active:scale-95 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {paymentMode === "single" ? "Submit Setup" : "Submit Milestones"}
          </button>
        </div>
      </div>
    </div>
  );
}
