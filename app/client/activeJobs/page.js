import React from "react";
import Link from "next/link";
import mongoose from "mongoose";
import { ProjectPost } from "@/schemas/project.schema";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import { dbConnect } from "@/config/db.config";
import { Proposal } from "@/schemas/proposal.schema";

export const revalidate = 0;

export default async function ApprovedJobsPage() {
  const res = await authAndGetUser();

  if (!res.success || !res.id) {
    return (
      <div className="p-6 text-center text-red-500">
        Authentication failed. Please log in.
      </div>
    );
  }

  let jobs = [];
  let error = null;

  try {
    await dbConnect();
    const objClientId = new mongoose.Types.ObjectId(res.id);

    const rawJobs = await ProjectPost.aggregate([
      {
        $match: {
          status: "approved",
          clientId: objClientId,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "proposals",
          localField: "_id",
          foreignField: "jobId",
          as: "proposalStats",
          pipeline: [{ $count: "count" }],
        },
      },
      {
        $project: {
          _id: 1,
          projectTitle: 1,
          projectCategory: 1,
          budgetRange: 1,
          projectDuration: 1,
          createdAt: 1,
          proposalCount: {
            $ifNull: [{ $arrayElemAt: ["$proposalStats.count", 0] }, 0],
          },
        },
      },
    ]);

    jobs = rawJobs.map((job) => ({
      id: job._id.toString(),
      title: job.projectTitle || "Untitled Job",
      category: job.projectCategory || "No description provided.",
      budgetRange: job.budgetRange || "0",
      duration: job.projectDuration || "0 weeks",
      createdAt: job.createdAt
        ? new Date(job.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Recently",
      proposalCount: job.proposalCount || 0,
    }));
  } catch (err) {
    error = "Failed to load jobs. Please try again later.";
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center mt-10">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
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
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3 shadow-sm">
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
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-5">Job Details</th>
                  <th className="py-4 px-5">Duration</th>
                  <th className="py-4 px-5">Budget</th>
                  <th className="py-4 px-5">Proposals</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-gray-50/70 transition-colors group"
                  >
                    <td className="py-4 px-5 max-w-[300px]">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-green-50 text-[#16A34A] border border-green-200">
                            Approved
                          </span>
                          <span className="text-[10px] font-medium text-gray-400">
                            Posted {job.createdAt}
                          </span>
                        </div>
                        <h2 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#16A34A] transition-colors">
                          {job.title}
                        </h2>
                        <p className="text-xs text-gray-500 truncate">
                          {job.category}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-gray-600 whitespace-nowrap">
                      {job.duration}
                    </td>

                    <td className="py-4 px-5 font-bold text-gray-900 whitespace-nowrap">
                      {job.budgetRange}
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          job.proposalCount > 0
                            ? "bg-green-50 text-[#16A34A] border-green-100"
                            : "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                      >
                        {job.proposalCount}{" "}
                        {job.proposalCount === 1 ? "Proposal" : "Proposals"}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2.5">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                        >
                          View Job
                        </Link>
                        <Link
                          href={`/client/activeJobs/${job.id}/proposal`}
                          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-2 active:scale-95 ${
                            job.proposalCount > 0
                              ? "bg-[#16A34A] hover:bg-green-700 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                          }`}
                        >
                          See Proposals
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
