import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectPost } from "@/schemas/project.schema";
import { Proposal } from "@/schemas/proposal.schema";
import { dbConnect } from "@/config/db.config";
import ProposalListInteractive from "./components/proposalListInteractive";
import { users } from "@/schemas/user.schema";

export const dynamic = "force-dynamic";

export default async function JobProposalsPage({ params }) {
  const { jobId } = await params;

  await dbConnect();

  const rawJob = await ProjectPost.findById(jobId).lean();

  if (!rawJob) {
    notFound();
  }

  const rawProposals = await Proposal.find({ jobId })
    .populate("contractorId", "name email")
    .sort({ createdAt: -1 })
    .lean();

  const job = {
    id: rawJob._id.toString(),
    title: rawJob.projectTitle || "Untitled Job",
    budget: rawJob.budgetRange || 0,
    status: rawJob.status || "approved",
  };

  const proposals = rawProposals.map((prop) => {
    const contractor = prop.contractorId;

    return {
      id: prop._id.toString(),
      contractorId: contractor._id,
      jobId: prop.jobId,
      contractorName:
        contractor?.name || prop.contractorName || "Anonymous Contractor",
      contractorEmail: contractor?.email || prop.contractorEmail || "N/A",
      coverLetter: prop.coverLetter || "",
      proposedBudget: prop.proposedBudget || 0,
      estimatedDuration: prop.estimatedDuration || "N/A",
      attachments: prop.attachments || [],
      status: prop.status || "pending",
      rejectionReason: prop.rejectionReason || null,
      createdAt: prop.createdAt
        ? new Date(prop.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Recently",
    };
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 font-sans min-h-screen bg-gray-50/50">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link
          href="/client/approved-jobs"
          className="hover:text-[#16A34A] transition-colors"
        >
          Approved Jobs
        </Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-xs">{job.title}</span>
        <span>/</span>
        <span className="text-[#16A34A]">Proposals</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-green-50 text-[#16A34A] border border-green-200">
              Job Status: {job.status}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              ID: {job.id}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-2.5">
            Applicants for "{job.title}"
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
            Review detailed proposals from contractors. Read cover letters,
            inspect attached portfolio documents, and make informed decisions to
            approve or reject candidates for this project.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl text-right shadow-inner">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Total Proposals
            </p>
            <p className="font-extrabold text-[#16A34A] text-2xl mt-0.5">
              {proposals.length}
            </p>
          </div>
        </div>
      </div>

      <ProposalListInteractive
        initialProposals={proposals}
        jobTitle={job.title}
        jobId={job.id}
      />
    </div>
  );
}
