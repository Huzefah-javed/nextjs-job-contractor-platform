"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  X,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { projectEscrowDetails } from "@/serverActions/projectEscrowDetails";
import { verifyCustomerEscrowStatus } from "@/serverActions/adminTransactionCreation";

export default function EscrowStatusModal({ projectId, onClose }) {
  const [escrowData, setEscrowData] = useState({});
  const [checkingStatus, setCheckingStatus] = useState(false);

  const fetchEscrowDetails = useCallback(async () => {
    if (!projectId) return;
    try {
      setCheckingStatus(true);
      const result = await projectEscrowDetails(projectId);
      console.log("result ", result);
      if (result.success) {
        setEscrowData(result.data);
      } else {
        alert("Error fetching escrow details");
      }
    } catch (error) {
      console.error("Error fetching escrow status:", error);
    } finally {
      setCheckingStatus(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchEscrowDetails();
  }, [fetchEscrowDetails]);

  const handleCheckEscrowStatus = async () => {
    const userRole = escrowData.clientNextUrl ? "buyer" : "seller";
    const res = await verifyCustomerEscrowStatus(
      escrowData.transactionId,
      userRole,
    );
    if (res.success && res.isChange) {
      if (userRole === "buyer") {
        setEscrowData((prev) => ({ ...prev, clientEscrowVerified: true }));
      }
      if (userRole === "seller") {
        setEscrowData((prev) => ({ ...prev, contractorEscrowVerified: true }));
      }
      console.log("change done");
    } else if (res.success && !res.isChange) {
      console.log("you are not verified on escrow till now");
    } else {
      console.log(res.message);
    }
  };

  // Detect which side's verification field is provided by the API
  const isContractorSide =
    typeof escrowData?.contractorEscrowVerified !== "undefined";
  const isClientSide = typeof escrowData?.clientEscrowVerified !== "undefined";

  const isEscrowVerified = isContractorSide
    ? Boolean(escrowData.contractorEscrowVerified)
    : isClientSide
      ? Boolean(escrowData.clientEscrowVerified)
      : false;

  const verificationLabel = isContractorSide
    ? "Contractor Escrow Verification"
    : "Client Escrow Verification";

  const verificationUrl = "www.escrow.com";

  const isClientAgreed = escrowData?.clientEscrowStatus !== "termsPending";
  const isContractorAgreed =
    escrowData?.proposalEscrowStatus === "termsAccepted";
  const isPaymentSent = escrowData?.clientEscrowStatus === "payment_sent";
  const isPaymentApproved =
    escrowData?.clientEscrowStatus === "payment_approved";

  // Step 1 is now Verification; subsequent steps shift accordingly
  const currentPendingStep = !isEscrowVerified
    ? 1
    : !isClientAgreed
      ? 2
      : !isContractorAgreed
        ? 2
        : !isPaymentSent
          ? 3
          : !isPaymentApproved
            ? 4
            : -1;

  const steps = [
    {
      step: 2,
      label: "Client and Contractor Agreed to Terms",
      isCompleted: isClientAgreed && isContractorAgreed,
      infoText:
        "Both need to agree the term, mutual agreement help in moving to next step",
      actionText: "Action Required",
      url: escrowData?.clientNextUrl || escrowData?.contractorNextUrl,
    },
    {
      step: 3,
      label: "Client Payment Sent (Funded)",
      isCompleted: isPaymentSent,
      actionText: "Fund Escrow (Client)",
      url: escrowData?.paymentLink,
    },
    {
      step: 4,
      label: "Client Payment Approved",
      isCompleted: isPaymentApproved,
      actionText: "View Status",
      url: escrowData?.checkStatusLink,
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Modal Container: Enforces 90vw width and 90vh max height */}
      <div className="bg-white border border-gray-200 rounded-[24px] shadow-2xl w-[90vw]  max-h-[90vh] relative flex flex-col overflow-hidden">
        {/* Header (Pinned) */}
        <div className="shrink-0 flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Escrow Contract Status
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Track verification, agreement, and funding status for this
              project.
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
                  <th className="px-8 py-4">Information</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* STEP 1: Escrow Verification (Top Row) */}
                {(isContractorSide || isClientSide) && (
                  <tr className="bg-amber-50/20 hover:bg-gray-50/60 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold shrink-0">
                          1
                        </span>
                        <div>
                          <p className="font-bold text-gray-900">
                            {verificationLabel}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {isEscrowVerified
                              ? "Your escrow account is verified and ready."
                              : "Verification is required before proceeding."}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      {isEscrowVerified ? (
                        <div className="inline-flex items-center gap-1.5 bg-[#16A34A]/10 text-[#16A34A] px-3 py-1 rounded-full text-xs font-bold border border-[#16A34A]/20">
                          <ShieldCheck size={14} />
                          Verified
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
                          <ShieldAlert size={14} />
                          Not Verified
                        </div>
                      )}
                    </td>

                    <td className="px-8 py-5 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        {!isEscrowVerified && (
                          <div className="flex gap-2">
                            <button className="inline-flex items-center gap-1.5 bg-[#16A34A] hover:bg-green-700 text-white px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all cursor-pointer shadow-sm">
                              Verify Yourself
                            </button>
                            <button
                              onClick={handleCheckEscrowStatus}
                              className="inline-flex items-center gap-1.5 bg-[#16A34A] hover:bg-green-700 text-white px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all cursor-pointer shadow-sm"
                            >
                              Check Escrow Verification
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {/* SUBSEQUENT STEPS */}
                {steps.map((step, index) => {
                  const isCurrentAction = step.step === currentPendingStep;

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

                      {step.step === currentPendingStep ? (
                        <td className="px-2 py-5">
                          <p
                            className={`font-bold text-gray-400 text-[0.75rem] w-32`}
                          >
                            {step.infoText || "N/A"}
                          </p>
                        </td>
                      ) : (
                        "-"
                      )}

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
                            Awaiting
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
                    Escrow Account Verification
                  </strong>
                  Verify your escrow account status first. Once verified, you
                  can proceed with contract terms and funding.
                </p>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-800 font-semibold block mb-0.5">
                    Mutual Agreement
                  </strong>
                  Both the client and the contractor must review and agree to
                  the project terms and fee breakdown before any funds can be
                  moved.
                </p>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-800 font-semibold block mb-0.5">
                    Equal 50/50 Fee Split (Platform &amp; Escrow Fees)
                  </strong>
                  Both the{" "}
                  <strong className="text-gray-700 font-medium">
                    15% platform broker fee
                  </strong>{" "}
                  (7.5% each) and the{" "}
                  <strong className="text-gray-700 font-medium">
                    Escrow.com processing fee
                  </strong>{" "}
                  (50% each) are divided equally between the client and the
                  contractor. Because of this split, the client deposits
                  slightly more than the base milestone amount, and the
                  contractor receives slightly less after their half of the fees
                  is deducted.
                </p>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-bold shrink-0 mt-0.5">
                  4
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-800 font-semibold block mb-0.5">
                    Funding &amp; Deposit
                  </strong>
                  Once both parties agree, the client deposits the milestone
                  funds along with their 50% share of the escrow and platform
                  fees into the secure escrow account.
                </p>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-bold shrink-0 mt-0.5">
                  5
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-800 font-semibold block mb-0.5">
                    Approval &amp; Project Activation
                  </strong>
                  After a successful deposit, the payment is verified and
                  approved. The project is marked as active, and the contractor
                  can officially begin work.
                </p>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-bold shrink-0 mt-0.5">
                  6
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-800 font-semibold block mb-0.5">
                    Milestone Delivery &amp; Payout Release
                  </strong>
                  When a milestone is completed and confirmed as received, the
                  client may accept it immediately or let the 1-day inspection
                  period conclude—at which point Escrow.com releases the net
                  payout to the contractor.
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
