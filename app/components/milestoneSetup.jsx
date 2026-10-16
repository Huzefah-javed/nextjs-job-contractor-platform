"use client";

import React, { useState } from "react";
import { X, Plus, Trash2, DollarSign, Layers } from "lucide-react";
import { setupProjectMilestones } from "@/serverActions/setupProjectMilestones";

export default function SetupMilestoneModal({ onClose, projectId }) {
  const [milestones, setMilestones] = useState([
    {
      id: crypto.randomUUID(),
      title: "",
      amount: "",
      weeks: "",
    },
  ]);

  const totalAmount = milestones.reduce(
    (sum, m) => sum + (parseFloat(m.amount) || 0),
    0,
  );

  const totalWeeks = milestones.reduce(
    (sum, m) => sum + (parseFloat(m.weeks) || 0),
    0,
  );

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      {
        id: crypto.randomUUID(),
        title: "",
        amount: "",
        weeks: "",
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

  const isFormValid =
    milestones.length > 0 &&
    milestones.every(
      (m) =>
        m.title.trim() !== "" &&
        parseFloat(m.amount) > 0 &&
        parseFloat(m.weeks) > 0,
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const cleanMilestonesForDb = milestones.map(({ id, ...rest }) => ({
      ...rest,
      amount: parseFloat(rest.amount),
      weeks: parseFloat(rest.weeks),
    }));

    const payload = {
      totalAmount,
      totalWeeks,
      milestones: cleanMilestonesForDb,
    };

    const res = await setupProjectMilestones(projectId, payload);
    console.log(res);
    if (onClose) onClose();
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
              Create Custom Offer
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Set your custom offer milestones for this project chat.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Summary Bar */}
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-4 bg-white p-3.5 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold">
                <DollarSign size={18} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  Total Offer Amount
                </div>
                <div className="text-sm font-bold text-gray-900">
                  ${totalAmount.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold">
                <Layers size={18} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  Total Duration & Count
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {totalWeeks} Weeks ({milestones.length} Milestone
                  {milestones.length > 1 ? "s" : ""})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Milestones List */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30 space-y-5">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px]">
                    {index + 1}
                  </span>
                  Milestone {index + 1}
                </h3>
                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(milestone.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Milestone Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., UI/UX Wireframes & Database Setup"
                    value={milestone.title}
                    onChange={(e) =>
                      handleChange(milestone.id, "title", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Amount ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">
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
                      className="w-full border border-gray-300 rounded-xl pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Duration (Weeks)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    min="0.5"
                    step="0.5"
                    value={milestone.weeks}
                    onChange={(e) =>
                      handleChange(milestone.id, "weeks", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddMilestone}
            className="w-full border-2 border-dashed border-gray-300 hover:border-[#16A34A] rounded-2xl py-3.5 flex items-center justify-center gap-2 text-xs font-bold text-gray-600 hover:text-[#16A34A] hover:bg-green-50/50 transition-all cursor-pointer"
          >
            <Plus size={16} /> Add Another Milestone
          </button>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-white rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all ${
              isFormValid
                ? "bg-[#16A34A] hover:bg-green-700 text-white active:scale-95 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Send Custom Offer
          </button>
        </div>
      </div>
    </div>
  );
}
