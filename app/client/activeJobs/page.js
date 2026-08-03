import React from "react";
import Link from "next/link";
import { ProjectPost } from "@/schemas/project.schema";
import mongoose from "mongoose";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import { dbConnect } from "@/config/db.config";
import { Proposal } from "@/schemas/proposal.schema";

export const revalidate = 0; // Force dynamic rendering on each request

export default async function ApprovedJobsPage() {
  const res = await authAndGetUser();
  if (!res.success) return { success: false };

  const objClientId = new mongoose.Types.ObjectId(res.id);

  await dbConnect();

  const rawJobs = await ProjectPost.find({
    status: "approved",
    clientId: objClientId,
  })
    .sort({ createdAt: -1 })
    .lean();

  const jobs = await Promise.all(
    rawJobs.map(async (job) => {
      const objJobId = new mongoose.Types.ObjectId(job._id);
      const proposalCount = await Proposal.countDocuments({
        jobId: objJobId,
      });

      return {
        id: job._id.toString(),
        title: job.projectTitle || "Untitled Job",
        category: job.projectCategory || "No description provided.",
        budgetRange: job.budgetRange || 0,
        duration: job.projectDuration || "0 weeks",
        createdAt: job.createdAt
          ? new Date(job.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recently",
        proposalCount,
      };
    }),
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 font-sans">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
              Active Listings
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Approved Jobs
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your admin-approved projects and review incoming freelancer
            proposals.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-2xl w-fit">
          <span className="text-xs font-medium text-gray-600">
            Total Approved:
          </span>
          <span className="text-xs font-bold bg-[#16A34A] text-white px-2.5 py-0.5 rounded-full">
            {jobs.length}
          </span>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 text-[#16A34A] flex items-center justify-center mx-auto text-lg font-bold">
            ✓
          </div>
          <h3 className="text-base font-bold text-gray-900">
            No Approved Jobs Found
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            You don't have any jobs approved by the admin yet. Once your
            submitted jobs are reviewed, they will appear here.
          </p>
        </div>
      ) : (
        /* Grid Layout of Dynamic Approved Job Cards */
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative group"
            >
              <div className="space-y-3">
                {/* Top Bar: Badge & Date */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-green-50 text-[#16A34A] border border-green-200">
                    Approved
                  </span>
                  <span className="text-[11px] font-medium text-gray-400">
                    Posted {job.createdAt}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h2 className="text-base font-bold text-gray-900 group-hover:text-[#16A34A] transition-colors line-clamp-1">
                    {job.title}
                  </h2>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {job.category}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.duration}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                      Budget
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      {job.budgetRange}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                      Proposals
                    </p>
                    <p
                      className={`font-bold text-sm ${
                        job.proposalCount > 0
                          ? "text-[#16A34A]"
                          : "text-gray-400"
                      }`}
                    >
                      {job.proposalCount} Submitted
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-all text-center"
                  >
                    View Job
                  </Link>
                 
                  <Link
                    href={`/client/activeJobs/${job.id}/proposal`}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all shadow-sm text-center flex items-center justify-center gap-1.5 ${
                      job.proposalCount > 0
                        ? "bg-[#16A34A] hover:bg-green-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                  >
                    See Proposals
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        job.proposalCount > 0
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {job.proposalCount}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
