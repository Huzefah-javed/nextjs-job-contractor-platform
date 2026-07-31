"use client";

import React, { useState } from "react";

export default function ProjectDetailsModal({ project, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!project) return null;

  // Format dates cleanly
  const formattedStartDate = project.startDate
    ? new Date(project.startDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const formattedCreatedAt = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const document = project.documentFile || project.document;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white w-[90%] h-[95%] rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative  flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-green-50 text-[#16A34A] border border-green-200">
                {project.projectCategory || "General"}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-[#D9A34A] border border-amber-200 capitalize">
                {project.status || "pending"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {project.projectTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto font-sans">
          {/* Key Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#EFEEED]/40 p-4 rounded-2xl border border-gray-100 text-xs">
            <div>
              <p className="text-gray-400 font-semibold mb-0.5">Budget Range</p>
              <p className="font-bold text-gray-800">
                {project.budgetRange || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-semibold mb-0.5">Duration</p>
              <p className="font-bold text-gray-800">
                {project.projectDuration || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-semibold mb-0.5">Location</p>
              <p className="font-bold text-gray-800">
                {project.location || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-semibold mb-0.5">Start Date</p>
              <p className="font-bold text-gray-800">{formattedStartDate}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Project Scope & Description
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              {project.projectDescription ||
                "No detailed description provided."}
            </p>
          </div>

          {/* Image Gallery (1 to 5 images) */}
          {project.imageFiles.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Project Images ({project.imageFiles.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {project.imageFiles.map((img, idx) => {
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(img.secureUrl)}
                      className="relative h-24 rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-all group"
                    >
                      <img
                        src={img.secureUrl}
                        alt={`Project attachment ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {document && document.secureUrl && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Attached Specification Document
              </h3>
              <a
                href={document.secureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-white border border-gray-200 hover:border-[#16A34A] rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-50 text-[#16A34A] flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Click to open</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#16A34A] hover:underline">
                  Open
                </span>
              </a>
            </div>
          )}

          {/* Footer Timeline Info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-[11px] text-gray-400 font-medium">
            <p>
              Client ID:{" "}
              <span className="font-mono text-gray-600">
                {project.clientId}
              </span>
            </p>
            <p>Submitted: {formattedCreatedAt}</p>
          </div>
        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh]">
            <img
              src={selectedImage}
              alt="Enlarged project view"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 bg-white text-black font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
