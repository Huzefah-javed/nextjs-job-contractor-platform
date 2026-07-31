"use client";

import { getPaginatedUsers } from "@/serverActions/getPaginatedUsers";
import { useState, useEffect, useActionState, useTransition } from "react";
import ContractorDetailsModal from "./ContractorDetailModal";
import ClientDetailsModal from "./ClientDetailModal";
import { userProfileStatus } from "@/serverActions/userProfileStatus";
import LoadingSpinner from "@/app/loading";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All Roles");
  const [status, setStatus] = useState("All Status");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(true);
  const [view, setView] = useState(null);

  const [isPending, startTransition] = useTransition();

  const handleAdminAction = (action, user) => {
    if (action === "view") return setView(user);
    if (!["approved", "suspend", "reject"].includes(action)) return;
    startTransition(async () => {
      await userProfileStatus(user, action);
      if (view) setView(null);
      setRefreshKey((prev) => !prev);
    });
  };
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const result = await getPaginatedUsers({
        page,
        limit: 10,
        search,
        role,
        status,
      });

      if (result.success) {
        setUsers(result.Users);
        setTotalPages(result.totalPages);
      }
      setIsLoading(false);
    }

    loadData();
  }, [page, search, role, status, refreshKey]);

  return (
    <div className="space-y-6">
      {isPending && <LoadingSpinner />}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-4 pr-4 py-2 bg-gray-100 text-sm rounded-full focus:outline-none"
            />
          </div>

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="bg-gray-100 px-4 py-2 text-sm rounded-full focus:outline-none text-gray-700 cursor-pointer"
          >
            <option>All Roles</option>
            <option>Client</option>
            <option>Contractor</option>
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="bg-gray-100 px-4 py-2 text-sm rounded-full focus:outline-none text-gray-700 cursor-pointer"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Suspended</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">
            Updating table view...
          </div>
        ) : users?.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No matching user records found.
          </div>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-[11px] font-bold text-emerald-600 uppercase bg-gray-50">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Region</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-gray-600 divide-y">
                {users?.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-800">{user.name}</td>
                    <td className="py-4 px-6 capitalize">{user.role}</td>
                    <td className="py-4 px-6">{user.region || "N/A"}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] text-white capitalize ${
                          user.profileStatus === "approved"
                            ? "bg-green-500"
                            : user.profileStatus === "suspend"
                              ? "bg-orange-500"
                              : user.profileStatus === "reject"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                        }`}
                      >
                        {user.profileStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAdminAction("view", user)}
                          className="px-3 py-1 bg-gray-300 text-white rounded-full text-[10px] font-bold hover:bg-gray-400 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            handleAdminAction("approved", user._id)
                          }
                          className="px-3 py-1 bg-green-600 text-white rounded-full text-[10px] font-bold hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAdminAction("suspend", user._id)}
                          className="px-3 py-1 bg-orange-600 text-white rounded-full text-[10px] font-bold hover:bg-orange-700 transition-colors"
                        >
                          Suspend
                        </button>
                        <button
                          onClick={() => handleAdminAction("reject", user._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-bold hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between px-6 py-4 border-t text-xs font-semibold text-gray-600">
              <div>
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-1.5 rounded-full border disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-1.5 rounded-full border disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {view && view?.role === "contractor" && (
        <ContractorDetailsModal
          user={view}
          onClose={() => setView(null)}
          onApprove={() => handleAdminAction("approved", view._id)}
          onReject={() => handleAdminAction("reject", view._id)}
        />
      )}
      {view && view?.role === "client" && (
        <ClientDetailsModal
          client={view}
          onClose={() => setView(null)}
          onApprove={() => handleAdminAction("approved", view._id)}
          onReject={() => handleAdminAction("reject", view._id)}
        />
      )}
    </div>
  );
}
