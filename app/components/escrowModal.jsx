"use client";

import React, { useEffect, useState } from "react";
import { X, CheckCircle2, Clock, ExternalLink, Info } from "lucide-react";
import { projectEscrowDetails } from "@/serverActions/projectEscrowDetails";

export default function EscrowStatusModal({ projectId, onClose }) {
  const [escrowData, setEscrowData] = useState({});

  useEffect(() => {
    async function fetch() {
      const result = await projectEscrowDetails(projectId);
      console.log("result ", result);
      if (result.success) {
        setEscrowData(result.data);
      } else {
        alert("Error");
      }
    }
    fetch();
  }, []);

  const isClientAgreed = escrowData?.clientEscrowStatus !== "termsPending";
  const isContractorAgreed =
    escrowData?.proposalEscrowStatus === "termsAccepted";
  const isPaymentSent = escrowData?.clientEscrowStatus === "payment_sent";
  const isPaymentApproved =
    escrowData?.clientEscrowStatus === "payment_approved";

  const currentPendingStep = !isClientAgreed
    ? 0
    : !isContractorAgreed
      ? 1
      : !isPaymentSent
        ? 2
        : !isPaymentApproved
          ? 3
          : -1;

  const steps = [
    {
      label: "Client Agreed to Terms",
      isCompleted: isClientAgreed,
      actionText: "Client Action Required",
      url: escrowData?.clientNextUrl,
    },
    {
      label: "Contractor Agreed to Terms",
      isCompleted: isContractorAgreed,
      actionText: "Contractor Action Required",
      url: escrowData?.contractorNextUrl,
    },
    {
      label: "Client Payment Sent (Funded)",
      isCompleted: isPaymentSent,
      actionText: "Fund Escrow (Client)",
      url: `https://www.escrow-sandbox.com/transactions/${escrowData?.transactionId}/payment`,
    },
    {
      label: "Client Payment Approved",
      isCompleted: isPaymentApproved,
      actionText: "View Status",
      url: escrowData?.clientNextUrl,
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Modal Container: Enforces 90vw width and 90vh max height */}
      <div className="bg-white border border-gray-200 rounded-[24px] shadow-2xl w-[90vw] max-w-3xl max-h-[90vh] relative flex flex-col overflow-hidden">
        {/* Header (Pinned) */}
        <div className="shrink-0 flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Escrow Contract Status
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Track the agreement and funding status for this project.
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2.5 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Scrollable Middle Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Table Content */}
          <div className="p-0 w-full overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap sm:whitespace-normal">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-8 py-4">Requirement / Step</th>
                  <th className="px-8 py-4">Current Status</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {steps.map((step, index) => {
                  const isCurrentAction = index === currentPendingStep;

                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50/40 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <p
                          className={`font-bold ${step.isCompleted ? "text-gray-900" : "text-gray-600"}`}
                        >
                          {step.label}
                        </p>
                      </td>

                      <td className="px-8 py-5">
                        {step.isCompleted ? (
                          <div className="inline-flex items-center gap-1.5 bg-[#16A34A]/10 text-[#16A34A] px-3 py-1 rounded-full text-xs font-bold border border-[#16A34A]/20">
                            <CheckCircle2 size={14} />
                            Completed
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                            <Clock size={14} />
                            Pending
                          </div>
                        )}
                      </td>

                      <td className="px-8 py-5 text-right">
                        {isCurrentAction && step.url ? (
                          <a
                            href={step.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold text-xs transition-all cursor-pointer shadow-sm"
                          >
                            {step.actionText}
                            <ExternalLink size={14} />
                          </a>
                        ) : step.isCompleted ? (
                          <span className="text-xs text-gray-400 font-medium">
                            —
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                            Awaiting Prior Steps
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Instructions Section */}
          <div className="px-8 py-6 bg-gray-50/40 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-gray-900">
              <Info size={16} className="text-[#16A34A]" />
              <h3 className="text-sm font-bold">
                How the Escrow Process Works
              </h3>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-800 font-semibold block mb-0.5">
                    Mutual Agreement
                  </strong>
                  Both the client and the contractor must review and agree to
                  the project terms before any funds can be moved.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-800 font-semibold block mb-0.5">
                    Funding Eligibility
                  </strong>
                  Once both parties have agreed, the client becomes eligible to
                  deposit the required milestone funds into the secure escrow
                  account.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-800 font-semibold block mb-0.5">
                    Approval & Activation
                  </strong>
                  After a successful deposit, the payment is verified and
                  approved. The project is then marked as active, and work can
                  officially begin.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer (Pinned) */}
        <div className="shrink-0 bg-gray-50 border-t border-gray-100 px-8 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <p className="text-[11px] text-gray-500 font-medium">
            Escrow services are securely managed by your payment provider.
          </p>
          <button
            onClick={onClose}
            className="bg-[#9CA3AF] hover:bg-gray-500 text-white px-6 py-2.5 rounded-full font-medium text-xs transition-colors cursor-pointer shrink-0"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
