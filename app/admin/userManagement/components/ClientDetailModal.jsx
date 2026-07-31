"use client";

import React from "react";

export default function ClientDetailsModal({
  client,
  onClose,
  onApprove,
  onReject,
}) {
  return (
    <div className="fixed inset-0 max-h-screen z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-h-[90%] p-8 overflow-y-scroll max-w-5xl w-full shadow-2xl border border-gray-100 space-y-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-[#16A34A]">Client Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold px-2"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Information Cards */}
          <div className="lg:col-span-7 space-y-4">
            {/* Account Information */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
              <h3 className="text-sm font-bold text-[#16A34A]">
                Account & Contact Information
              </h3>
              <div className="text-xs space-y-1 text-gray-700 font-medium">
                <p>
                  <span className="font-bold text-gray-900">
                    Representative Name:
                  </span>{" "}
                  {client?.name || "unknown"}
                </p>
                <p>
                  <span className="font-bold text-gray-900">
                    Company Email:
                  </span>{" "}
                  {client?.companyEmail || "unknown"}
                </p>
                <p>
                  <span className="font-bold text-gray-900">Phone Number:</span>{" "}
                  {client?.phone || "unknown"}
                </p>
                <p>
                  <span className="font-bold text-gray-900">Region:</span>{" "}
                  {client?.region || "unknown"}
                </p>
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
              <h3 className="text-sm font-bold text-[#16A34A]">
                Verification Status
              </h3>
              <div className="text-xs space-y-1 text-gray-700 font-medium">
                <p>
                  <span className="font-bold text-gray-900">Status:</span>{" "}
                  <span className="capitalize font-semibold text-amber-600">
                    {client?.profileStatus || "pending"}
                  </span>
                </p>
                <p>
                  <span className="font-bold text-gray-900">Account Role:</span>{" "}
                  <span className="capitalize">{client?.role || "client"}</span>
                </p>
              </div>
            </div>

            {/* Company Profile Details */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
              <h3 className="text-sm font-bold text-[#16A34A]">
                Company Profile Information
              </h3>
              <div className="text-xs space-y-1 text-gray-700 font-medium">
                <p>
                  <span className="font-bold text-gray-900">Company Name:</span>{" "}
                  {client?.companyName || "unknown"}
                </p>
                <p>
                  <span className="font-bold text-gray-900">
                    Role in Company:
                  </span>{" "}
                  {client?.repRole || "unknown"}
                </p>
                <p>
                  <span className="font-bold text-gray-900">Company Size:</span>{" "}
                  {client?.companySize
                    ? `${client.companySize} employees`
                    : "unknown"}
                </p>
                <p>
                  <span className="font-bold text-gray-900">
                    Tax ID / Reg No:
                  </span>{" "}
                  {client?.taxId || "unknown"}
                </p>
                <p>
                  <span className="font-bold text-gray-900">Client ID:</span>{" "}
                  {client?._id}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Uploaded Documents Cards */}
          <div className="lg:col-span-5 flex flex-col justify-start gap-4">
            <DocumentCard
              title="Company Registration Document"
              previewUrl={client?.companyRegistrationDoc}
              placeholderText="Company Reg Document Preview"
            />
            <DocumentCard
              title="Representative ID Document"
              previewUrl={client?.representativeIdDoc}
              placeholderText="Representative ID Preview"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => onApprove && onApprove(client?._id)}
            className="px-8 py-2.5 bg-[#16A34A] text-white text-xs font-bold rounded-full hover:bg-green-700 transition-colors shadow-md"
          >
            Approve Client
          </button>

          <button
            onClick={() => onReject && onReject(client?._id)}
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
  const isPdfFile = previewUrl?.includes(".pdf") ? true : false;
  let pdfImgPrev = null;
  if (isPdfFile) {
    pdfImgPrev = previewUrl?.replace(".pdf", ".jpg");
  }
  return (
    <div className="bg-[#1E1E1E] rounded-2xl p-4 text-center flex flex-col justify-between shadow-md space-y-3">
      <h4 className="text-xs font-bold text-[#16A34A]">{title}</h4>

      <div className="bg-[#CCCCCC] rounded-xl h-28 flex items-center justify-center p-2 text-[11px] font-semibold text-gray-600 overflow-hidden">
        {previewUrl ? (
          <img
            src={isPdfFile ? pdfImgPrev : previewUrl}
            alt={title}
            className="h-full w-full object-cover rounded-lg"
          />
        ) : (
          <span>{placeholderText}</span>
        )}
      </div>

      <div>
        <a
          href={previewUrl}
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
