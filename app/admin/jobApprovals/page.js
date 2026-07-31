import { dbConnect } from "@/config/db.config";
import ContractorCardsList from "./components/ContractorCardsList";
import { ProjectPost } from "@/schemas/project.schema";

async function fetchData() {
  try {
    await dbConnect();

    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    const [statsResult] = await ProjectPost.aggregate([
      {
        $facet: {
          pendingApplications: [
            { $match: { status: "pending" } },
            { $count: "count" },
          ],
          approvedThisWeek: [
            {
              $match: {
                status: "approved",
                updatedAt: { $gte: startOfWeek },
              },
            },
            { $count: "count" },
          ],
          rejected: [{ $match: { status: "reject" } }, { $count: "count" }],
        },
      },
    ]);

    return [
      {
        label: "Pending Applications",
        count: statsResult?.pendingApplications[0]?.count || 0,
      },
      {
        label: "Approved This Week",
        count: statsResult?.approvedThisWeek[0]?.count || 0,
      },
      {
        label: "Rejected",
        count: statsResult?.rejected[0]?.count || 0,
      },
    ];
  } catch (error) {
    console.error("Error fetching project stats:", error);
    return [
      { label: "Pending Applications", count: 0 },
      { label: "Approved This Week", count: 0 },
      { label: "Rejected", count: 0 },
    ];
  }
}

export default async function ContractorApprovalsPage() {
  const result = await fetchData();

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-gray-50/50 min-h-screen font-sans">
      <h1 className="text-xl font-bold text-gray-800 mb-6">
        Contractor Approvals
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {result.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100"
          >
            <p className="text-xs text-gray-400 font-medium mb-2">
              {stat.label}
            </p>
            <p className="text-sm font-bold text-gray-800">{stat.count}</p>
          </div>
        ))}
      </div>

      <ContractorCardsList />
    </div>
  );
}
