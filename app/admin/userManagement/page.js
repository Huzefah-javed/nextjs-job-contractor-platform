import { dbConnect } from "@/config/db.config";
import { users } from "@/schemas/user.schema";

export const revalidate = 60; 

export default async function UserManagement() {
  let fetchedUsersList = [];
  let errorMsg = null;

  let metrics = {
    total: 0,
    active: 0,
    suspended: 0,
    pending: 0,
  };

  try {
    await dbConnect();

    fetchedUsersList = await users
      .find({
        role: { $in: ["contractor", "client"] },
      })
      .select("name role region status email")
      .lean();

    metrics.total = fetchedUsersList.length;
    metrics.active = fetchedUsersList.filter(
      (u) => u.status?.toLowerCase() === "approved",
    ).length;
    metrics.suspended = fetchedUsersList.filter(
      (u) => u.status?.toLowerCase() === "suspended",
    ).length;
    metrics.pending = fetchedUsersList.filter((u) => {
      return u.status?.toLowerCase() === "pending";
    }).length;
  } catch (error) {
    console.error(error);
    errorMsg = "Database error: Unable to load dashboard records.";
  }

  return (
    <div className="space-y-6 p-8 bg-[#FAFAFA] min-h-screen font-sans text-gray-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Total Users
          </div>
          <div className="text-lg font-bold text-gray-800">
            {errorMsg ? "—" : metrics.total}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Active Accounts
          </div>
          <div className="text-lg font-bold text-gray-800">
            {errorMsg ? "—" : metrics.active}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Suspended Accounts
          </div>
          <div className="text-lg font-bold text-gray-800">
            {errorMsg ? "—" : metrics.suspended}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Pending Verifications
          </div>
          <div className="text-lg font-bold text-gray-800">
            {errorMsg ? "—" : metrics.pending}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-4 py-2 bg-[#EAEAEA]/60 text-sm rounded-full focus:outline-none placeholder-gray-400 text-gray-700"
            />
          </div>

          <div className="relative">
            <select className="appearance-none bg-[#EAEAEA]/60 pl-4 pr-10 py-2 text-sm font-semibold rounded-full focus:outline-none text-gray-700 cursor-pointer">
              <option>All Roles</option>
            </select>
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </div>

          <div className="relative">
            <select className="appearance-none bg-[#EAEAEA]/60 pl-4 pr-10 py-2 text-sm font-semibold rounded-full focus:outline-none text-gray-700 cursor-pointer">
              <option>All Status</option>
            </select>
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </div>
        </div>

        <button className="px-6 py-2 bg-[#1E1E1E] text-white text-xs font-bold rounded-full hover:bg-black transition-colors tracking-wide">
          Create New User
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {errorMsg ? (
            <div className="p-8 text-center text-red-500 font-semibold">
              {errorMsg}
            </div>
          ) : fetchedUsersList.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No client or contractor documents discovered.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-[#22C55E] uppercase tracking-wider bg-white">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Region</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right sm:text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                {fetchedUsersList.map((user) => {
                  const normalizedStatus =
                    user.status?.toLowerCase() || "pending";

                  let statusBadgeClass = "bg-[#EAB308] text-white";
                  if (normalizedStatus === "active")
                    statusBadgeClass = "bg-[#22C55E] text-white";
                  if (normalizedStatus === "suspended")
                    statusBadgeClass = "bg-[#EF4444] text-white";

                  return (
                    <tr
                      key={user._id.toString()}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-800 font-medium">
                        {user.name || "Unnamed User"}
                      </td>
                      <td className="py-4 px-6 capitalize">{user.role}</td>
                      <td className="py-4 px-6">{user.region || "N/A"}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide capitalize ${statusBadgeClass}`}
                        >
                          {user.status || "Pending Approval"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <button className="px-3 py-1 bg-gray-300 text-white rounded-full text-[10px] font-bold hover:bg-gray-400 transition-colors">
                            View
                          </button>
                          <button className="px-3 py-1 bg-gray-300 text-white rounded-full text-[10px] font-bold hover:bg-gray-400 transition-colors">
                            Edit
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-bold hover:bg-red-700 transition-colors">
                            Suspend
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
