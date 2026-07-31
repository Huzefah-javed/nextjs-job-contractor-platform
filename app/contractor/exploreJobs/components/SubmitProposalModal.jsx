"use client";

import LoadingSpinner from "@/app/loading";
import { submitProposalAction } from "@/serverActions/proposalAction";
import React, { useActionState, useState } from "react";

export default function SubmitProposalModal({ job, isOpen, onClose }) {
  const [attachments, setAttachments] = useState([]);
  const [state, formActon, isPending] = useActionState(
    submitProposalAction,
    {},
  );

  const handleAddAttachment = (e) => {
    const files = Object.entries(e.target.files).map((arr) => arr[1]);
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (formData) => {
    const form = {
      jobId: job._id,
      coverLetter: formData.get("coverLetter"),
      estimatedDuration: formData.get("estimatedDuration"),
      proposedBudget: formData.get("proposedBudget"),
      attachments,
    };
    await formActon(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto font-sans">
      {isPending && <LoadingSpinner />}
      <div className="bg-white w-[90vw]  rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative max-h-[90vh] flex flex-col my-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-green-50 text-[#16A34A] border border-green-200">
              Submit Proposal
            </span>
            <h2 className="text-lg font-bold text-gray-900 leading-tight mt-1">
              {job?.projectCategory}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all focus:outline-none text-sm"
          >
            ✕
          </button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div className="hidden p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
            An error occurred while submitting your proposal.
          </div>

          <div className="hidden p-3.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-semibold">
            Proposal submitted successfully!
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Proposed Budget ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                name="proposedBudget"
                placeholder="e.g. 1500"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#16A34A] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Project duration <span className="text-red-500">*</span>
              </label>
              <select
                name="estimatedDuration"
                className={`w-full bg-[#EFEEED]/60 border rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:bg-white transition-all cursor-pointer
                  border-transparent focus:border-[#16A34A]`}
              >
                <option value="" disabled>
                  Select Duration
                </option>
                <option value="1 Week">1 Week</option>
                <option value="2 Weeks">2 Weeks</option>
                <option value="4 Weeks">4 Weeks</option>
                <option value="8 Weeks">8 Weeks</option>
                <option value="12 Weeks">12 Weeks</option>
                <option value="16+ Weeks">16+ Weeks</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Cover Letter <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-gray-400">
                0 / 2000 chars (Min 100)
              </span>
            </div>
            <textarea
              rows={5}
              name="coverLetter"
              placeholder="Explain your approach, technical experience, and why you are the best fit for this project..."
              className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#16A34A] transition-all leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Attachments / Portfolio Proof (Optional)
            </label>

            <div className="relative border-2 border-dashed border-gray-200 hover:border-[#16A34A] bg-gray-50/50 rounded-2xl p-5 text-center transition-all cursor-pointer group">
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                onChange={handleAddAttachment}
              />
              <div className="space-y-1">
                <div className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-500 flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
                  ↑
                </div>
                <p className="text-xs font-bold text-gray-700">
                  Click or drag files to upload
                </p>
                <p className="text-[10px] text-gray-400">
                  Supports Images, PDFs, and Docs
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-3">
              {attachments?.map((attach, i) => {
                return (
                  <>
                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs shadow-sm">
                      <div className="flex items-center gap-2.5 truncate mr-2">
                        <span className="w-2 h-2 rounded-full bg-[#16A34A] flex-shrink-0" />
                        <p className="font-semibold text-gray-800 truncate">
                          {attach.name}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(i)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#16A34A] hover:bg-green-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
            >
              Send Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
