"use client";

import { getPaginatedUsers } from "@/serverActions/getPaginatedUsers";
import { useState, useEffect } from "react";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All Roles");
  const [status, setStatus] = useState("All Status");
  const [isLoading, setIsLoading] = useState(true);

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
      console.log(result);
      if (result.success) {
        setUsers(result.Users);
        setTotalPages(result.totalPages);
      }
      setIsLoading(false);
    }

    loadData();
  }, [page, search, role, status]);

  return (
    <div className="space-y-6">
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
                          user.profileStatus === "active"
                            ? "bg-green-500"
                            : user.profileStatus === "suspended"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }`}
                      >
                        {user.profileStatus}
                      </span>
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
    </div>
  );
}
