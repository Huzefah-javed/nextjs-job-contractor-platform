"use client";

import LoadingSpinner from "@/app/loading";
import { postProjectAction } from "@/serverActions/postProjectAction";
import React, { useState, useActionState } from "react";

export default function PostProjectForm() {
  const [imageFiles, setImageFiles] = useState([]);
  const [documentFilename, setDocumentFilename] = useState(null);
  const [state, formAction, isPending] = useActionState(postProjectAction, {});

  const handleImageUpload = (e) => {
    const files = Object.entries(e.target.files).map((arr) => arr[1]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleDocumentUpload = (e) => {
    setDocumentFilename(e.target.files?.[0].name);
  };

  const handleForm = async (formData) => {
    const payload = {
      projectTitle: formData.get("projectTitle"),
      projectCategory: formData.get("projectCategory"),
      projectDescription: formData.get("projectDescription"),
      budgetRange: formData.get("budgetRange"),
      projectDuration: formData.get("projectDuration"),
      location: formData.get("location"),
      startDate: formData.get("startDate"),
      imageFiles,
      documentFile: formData.get("documentFile"),
      status: "pending",
    };

    console.log("Form Payload Args:", payload);

    await formAction(payload);
  };

  if (state) console.log(state);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 font-sans">
      {isPending && <LoadingSpinner />}
      <h2 className="text-lg font-bold text-[#16A34A] mb-6 tracking-wide uppercase">
        Post Details
      </h2>

      <form
        action={(formData) => handleForm(formData, "pending")}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              name="projectTitle"
              required
              className={`w-full bg-[#EFEEED]/60 border rounded-xl px-4 py-3 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${
                state?.errors?.projectTitle
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent focus:border-[#16A34A]"
              }`}
            />
            {state?.errors?.projectTitle && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {state.errors.projectTitle[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Project Category *
            </label>
            <select
              name="projectCategory"
              className={`w-full bg-[#EFEEED]/60 border rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:bg-white transition-all cursor-pointer ${
                state?.errors?.projectCategory
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent focus:border-[#16A34A]"
              }`}
            >
              <option value="General Contracting">General Contracting</option>
              <option value="Electrical">Electrical Work</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Interior Design">Interior Design</option>
              <option value="Full stack development">
                Full stack development
              </option>
            </select>
            {state?.errors?.projectCategory && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {state.errors.projectCategory[0]}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            Project Description *
          </label>
          <textarea
            name="projectDescription"
            rows={4}
            placeholder="Describe full project scope, requirements, materials, compliance, and milestones..."
            className={`w-full bg-[#EFEEED]/60 border rounded-xl p-4 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-all resize-none ${
              state?.errors?.projectDescription
                ? "border-red-500 focus:border-red-500"
                : "border-transparent focus:border-[#16A34A]"
            }`}
          />
          {state?.errors?.projectDescription && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              {state.errors.projectDescription[0]}
            </p>
          )}
        </div>

        {/* Row 3: Budget Range & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Budget Range *
            </label>
            <select
              name="budgetRange"
              className={`w-full bg-[#EFEEED]/60 border rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:bg-white transition-all cursor-pointer ${
                state?.errors?.budgetRange
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent focus:border-[#16A34A]"
              }`}
            >
              <option value="" disabled>
                Select Budget Range
              </option>
              <option value="$1,000-$5,000">$1,000 - $5,000</option>
              <option value="$5,000-$10,000">$5,000 - $10,000</option>
              <option value="$10,000-$25,000">$10,000 - $25,000</option>
              <option value="$25,000-$50,000">$25,000 - $50,000</option>
              <option value="$50,000-$100,000">$50,000 - $100,000</option>
              <option value="$100,000+">$100,000+</option>
            </select>
            {state?.errors?.budgetRange && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {state.errors.budgetRange[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Project Duration *
            </label>
            <select
              name="projectDuration"
              className={`w-full bg-[#EFEEED]/60 border rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:bg-white transition-all cursor-pointer ${
                state?.errors?.projectDuration
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent focus:border-[#16A34A]"
              }`}
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
            {state?.errors?.projectDuration && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {state.errors.projectDuration[0]}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g. New York, NY or Online"
              className={`w-full bg-[#EFEEED]/60 border rounded-xl px-4 py-3 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${
                state?.errors?.location
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent focus:border-[#16A34A]"
              }`}
            />
            {state?.errors?.location && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {state.errors.location[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              className={`w-full bg-[#EFEEED]/60 border rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:bg-white transition-all ${
                state?.errors?.startDate
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent focus:border-[#16A34A]"
              }`}
            />
            {state?.errors?.startDate && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {state.errors.startDate[0]}
              </p>
            )}
          </div>
        </div>

        {/* Row 5: Upload Images */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            Upload Images
          </label>
          <label
            className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50/50 transition-colors ${
              state?.errors?.imageFiles
                ? "border-red-500 bg-red-50/20"
                : "border-gray-200"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-2 pb-3">
              <svg
                className="w-5 h-5 mb-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <p className="text-xs text-gray-400 font-medium">
                Click or drag & drop images here (multiple allowed)
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {imageFiles.length > 0 && (
            <p className="text-xs text-[#16A34A] mt-1 font-semibold">
              {imageFiles.length} image(s) selected
            </p>
          )}
          {state?.errors?.imageFiles && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              {state.errors.imageFiles[0]}
            </p>
          )}
        </div>

        {/* Row 6: Upload Documents */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            Upload Documents
          </label>
          <label
            className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50/50 transition-colors ${
              state?.errors?.documentFile
                ? "border-red-500 bg-red-50/20"
                : "border-gray-200"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-2 pb-3">
              <svg
                className="w-5 h-5 mb-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <p className="text-xs text-gray-400 font-medium">
                Click or drag file to upload document
              </p>
            </div>
            <input
              type="file"
              name="documentFile"
              accept=".pdf,.doc,.docx"
              onChange={handleDocumentUpload}
              className="hidden"
            />
          </label>
          {documentFilename && (
            <p className="text-xs text-[#16A34A] mt-1 font-semibold">
              Selected: {documentFilename}
            </p>
          )}
          {state?.errors?.documentFile && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              {state.errors.documentFile[0]}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            formAction={(formData) => handleForm(formData, "draft")}
            className="px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs font-bold transition-all"
          >
            Save Draft
          </button>

          <button
            type="submit"
            formAction={(formData) => handleForm(formData, "pending")}
            className="px-6 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all shadow-md shadow-green-600/20"
          >
            Publish Project
          </button>
        </div>
      </form>
    </div>
  );
}
