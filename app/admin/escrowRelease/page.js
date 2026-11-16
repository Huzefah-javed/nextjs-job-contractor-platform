import React from "react";
import EscrowSummaryStats from "./components/EscrowSummaryStats";
import EscrowProjectCard from "./components/escrowProjectCard";
import { getPendingEscrowProjectsAction } from "@/serverActions/adminEscrowPendings";

const SUMMARY_STATS = [
  { label: "Pending Release Requests", value: "6" },
  { label: "Total Funds in Escrow", value: "$182,600" },
  { label: "Released This Week", value: "$24,900" },
  { label: "Platform Fees Collected", value: "$26,480" },
];

const PROJECTS_DATA = [
  {
    id: "proj-1",
    title: "Retail Buildout – San Francisco",
    contractor: "Prime Build Co.",
    client: "Bennett Development Group",
    milestoneAmount: "$4,500",
    transactionId: "#ESC-284739",
    statusText: "Pending Release (Escrow.com)",
    statusVariant: "pending",
    showMilestones: true,
    milestones: [
      {
        id: "MS-101",
        name: "Site Preparation & Demolition",
        amount: "$2,500",
        status: "Released",
        isReleased: true,
      },
      {
        id: "MS-102",
        name: "Foundation Complete",
        amount: "$4,500",
        status: "Completed",
        isReleased: false,
      },
      {
        id: "MS-103",
        name: "Framing & Structural Interior",
        amount: "$6,200",
        status: "In Progress",
        isReleased: false,
      },
    ],
  },
  {
    id: "proj-2",
    title: "Electrical Upgrade – San Diego",
    contractor: "WestGrid Electrical",
    client: "Harper Holdings LLC",
    milestoneAmount: "$3,200",
    transactionId: "#ESC-284739",
    statusText: "Client Approved – Awaiting Escrow Release",
    statusVariant: "approved",
    showMilestones: false,
    milestones: [
      {
        id: "MS-201",
        name: "Phase 1 Wiring",
        amount: "$3,200",
        status: "Completed",
        isReleased: false,
      },
    ],
  },
  {
    id: "proj-3",
    title: "HVAC Replacement – Los Angeles",
    contractor: "AirFlow Systems",
    client: "UrbanStruct Builders",
    milestoneAmount: "$5,800",
    transactionId: "#ESC-284739",
    statusText: "Funds Released",
    statusVariant: "released",
    showMilestones: false,
    milestones: [
      {
        id: "MS-301",
        name: "Installation Complete",
        amount: "$5,800",
        status: "Released",
        isReleased: true,
      },
    ],
  },
];

export default async function EscrowActivityPage() {
  const data = await getPendingEscrowProjectsAction();
  console.log(data);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] px-6 sm:px-10 py-8">
      <div className="max-w-[1380px] mx-auto">
        {/* Header Section */}
        <header className="mb-7">
          <h1 className="text-[26px] font-bold text-[#1E1E1E] tracking-tight">
            Escrow Activity (Powered by Escrow.com)
          </h1>
          <p className="text-[14px] text-[#4A4A4A] mt-0.5">
            Monitor escrow transactions and platform service fees. Payments are
            securely handled via Escrow.com.
          </p>
          <p className="text-[11px] text-[#A8A8A8] mt-0.5">
            Project Contract Connect does not hold or process escrow funds. All
            escrow services are provided by Escrow.com.
          </p>
        </header>

        {/* Top Summary Stats Component */}
        <EscrowSummaryStats stats={SUMMARY_STATS} />

        {/* Bottom Project Cards Rendered via .map() */}
        <section className="space-y-5">
          {data?.data?.map((project) => (
            <EscrowProjectCard
              key={project._id}
              title={project.projectTitle}
              contractor={project.contractorName}
              client={project.clientName}
              milestoneAmount={project.milestones.reduce(
                (a, elem) => (a += Number(elem.amount)),
                0,
              )}
              transactionId={project.transactionId}
              statusText={project.statusText}
              statusVariant={project.statusVariant}
              showMilestones={project.showMilestones}
              milestones={project.milestones}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
