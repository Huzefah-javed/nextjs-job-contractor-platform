"use client";

import React from "react";

export default function ContractorDetailsModal({
  user,
  onClose,
  onApprove,
  onReject,
}) {
  return (
    <div
      className="fixed inset-0 max-h-screen
     z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-h-[90%] p-8 overflow-y-scroll max-w-5xl w-full shadow-2xl border border-gray-100 space-y-6 relative">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-[#16A34A]">
            Contractor Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold px-2"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
              <h3 className="text-sm font-bold text-[#16A34A]">
                Account Information
              </h3>
              <div className="text-xs space-y-1 text-gray-700 font-medium">
                <p>
                  <span className="font-bold text-gray-900">First Name:</span>{" "}
                  {user.name?.split(" ")[0] || "unknown"}
                </p>
                <p>
                  <span className="font-bold text-gray-900">Last Name:</span>{" "}
                  {user.name?.split(" ")[1] || "unknown"}
                </p>
                <p>
                  <span className="font-bold text-gray-900">Email:</span>{" "}
                  {user.email || "unknown"}
                </p>
                <p>
                  <span className="font-bold text-gray-900">Country:</span>{" "}
                  {user.country || "United States"}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
              <h3 className="text-sm font-bold text-[#16A34A]">
                Verification Status
              </h3>
              <div className="text-xs space-y-1 text-gray-700 font-medium">
                <p>
                  <span className="font-bold text-gray-900">Status:</span>{" "}
                  <span className="capitalize font-semibold text-amber-600">
                    {user.profileStatus}
                  </span>
                </p>
                <p>
                  <span className="font-bold text-gray-900">Region:</span>{" "}
                  {user.region || "California"}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
              <h3 className="text-sm font-bold text-[#16A34A]">
                Contractor Profile Information
              </h3>
              <div className="text-xs space-y-1 text-gray-700 font-medium">
                <p>
                  <span className="font-bold text-gray-900">
                    Specialization:
                  </span>{" "}
                  {user.specialization || "unknown"}
                </p>
                <p>
                  <span className="font-bold text-gray-900">
                    Government ID / Passport No:
                  </span>{" "}
                  {user?.docNumber || "unknown"}
                </p>
                <p>
                  <span className="font-bold text-gray-900">
                    Contractor ID:
                  </span>{" "}
                  {user._id}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-start gap-4">
            <DocumentCard
              title="Government ID / Passport (Front)"
              previewUrl={user.docFrontLink}
              placeholderText="Uploaded ID Front Preview"
            />
            <DocumentCard
              title="Government ID / Passport (Back)"
              previewUrl={user.docBackLink}
              placeholderText="Uploaded ID Back Preview"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => onApprove && onApprove(user._id)}
            className="px-8 py-2.5 bg-[#16A34A] text-white text-xs font-bold rounded-full hover:bg-green-700 transition-colors shadow-md"
          >
            Approve Contractor
          </button>

          <button
            onClick={() => onReject && onReject(user._id)}
            className="px-8 py-2.5 bg-[#EF4444] text-white text-xs font-bold rounded-full hover:bg-red-700 transition-colors shadow-md"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function DocumentCard({ title, previewUrl, placeholderText }) {
  return (
    <div className="bg-[#1E1E1E] rounded-2xl p-4 text-center flex flex-col justify-between shadow-md space-y-3">
      <h4 className="text-xs font-bold text-[#16A34A]">{title}</h4>

      <div className="bg-[#CCCCCC] rounded-xl h-28 flex items-center justify-center p-2 text-[11px] font-semibold text-gray-600 overflow-hidden">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={title}
            className="h-full w-full object-cover rounded-lg"
          />
        ) : (
          <span>{placeholderText}</span>
        )}
      </div>

      <div>
        <a
          href={previewUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-1 bg-[#888888]/60 text-white text-[10px] font-bold rounded-full hover:bg-gray-600 transition-colors"
        >
          View
        </a>
      </div>
    </div>
  );
}
