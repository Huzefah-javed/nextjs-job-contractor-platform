import { users } from "@/schemas/user.schema";
import UserTable from "./components/UserTable";
import { dbConnect } from "@/config/db.config";

export const revalidate = 600;

async function getMetricsData() {
  await dbConnect();

  const result = await users.aggregate([
    {
      $match: { role: { $in: ["contractor", "client"] } },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: {
          $sum: {
            $cond: [{ $eq: [{ $toLower: "$profileStatus" }, "approved"] }, 1, 0],
          },
        },
        suspended: {
          $sum: {
            $cond: [{ $eq: [{ $toLower: "$profileStatus" }, "suspend"] }, 1, 0],
          },
        },
        pending: {
          $sum: {
            $cond: [{ $eq: [{ $toLower: "$profileStatus" }, "pending"] }, 1, 0],
          },
        },
      },
    },
  ]);

  return result[0] || { total: 0, active: 0, suspended: 0, pending: 0 };
}

export default async function UserManagementPage() {
  const metrics = await getMetricsData();

  return (
    <div className="space-y-6 p-8 bg-[#FAFAFA] min-h-screen font-sans text-gray-800">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        </div>
        <button className="px-6 py-2 bg-[#1E1E1E] text-white text-xs font-bold rounded-full hover:bg-black transition-colors tracking-wide">
          Create New User
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Total Users
          </div>
          <div className="text-lg font-bold text-gray-800">{metrics.total}</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Active Accounts
          </div>
          <div className="text-lg font-bold text-gray-800">
            {metrics.active}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Suspended Accounts
          </div>
          <div className="text-lg font-bold text-gray-800">
            {metrics.suspended}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Pending Verifications
          </div>
          <div className="text-lg font-bold text-gray-800">
            {metrics.pending}
          </div>
        </div>
      </div>

      <UserTable />
    </div>
  );
}
