export default function AdminOverview() {
    
    return (
    <div className="space-y-6 p-8 bg-[#FAFAFA] min-h-screen font-sans text-gray-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Total Users (All Roles)
          </div>
          <div className="text-lg font-bold text-gray-800">312</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Pending Contractor Approvals
          </div>
          <div className="text-lg font-bold text-gray-800">8</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Pending Job Approvals
          </div>
          <div className="text-lg font-bold text-gray-800">5</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Escrow Pending Release
          </div>
          <div className="text-lg font-bold text-gray-800">$48,200</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Total Clients
          </div>
          <div className="text-lg font-bold text-gray-800">124</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Total Contractors
          </div>
          <div className="text-lg font-bold text-gray-800">176</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Active Jobs (Live)
          </div>
          <div className="text-lg font-bold text-gray-800">42</div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">
          Approval Queues
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold text-[#22C55E] mb-3">
              Contractor Registrations
            </h3>
            <ul className="space-y-2 text-xs font-semibold text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-gray-400 text-lg leading-none">•</span>5
                New Applications (California)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400 text-lg leading-none">•</span>2
                Pending Verification Documents
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400 text-lg leading-none">•</span>1
                Re-submitted License Review
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#22C55E] mb-3">
              Job Posting Approvals
            </h3>
            <ul className="space-y-2 text-xs font-semibold text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-gray-400 text-lg leading-none">•</span>3
                New Jobs Awaiting Review
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400 text-lg leading-none">•</span>1
                Edited Job Pending Re-Approval
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400 text-lg leading-none">•</span>1
                Job Flagged for Compliance Check
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#E5E7EB]/60 border border-gray-200/40 rounded-2xl p-6">
        <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
          Escrow Control Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Total Funds in Escrow
            </div>
            <div className="text-lg font-bold text-gray-800">$182,600</div>
          </div>

          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Pending Release Requests
            </div>
            <div className="text-lg font-bold text-gray-800">6</div>
          </div>

          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Platform Service Fees Collected
            </div>
            <div className="text-lg font-bold text-gray-800">$26,480</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">
          Platform Configuration Snapshot
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-xs font-bold text-gray-700">
          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="text-gray-400">Primary Region:</span>
              <span className="text-gray-800">California</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">Escrow Model:</span>
              <span className="text-gray-800">Admin-Controlled Release</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">Service Fee:</span>
              <span className="text-gray-800">8% per project</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="text-gray-400">Job Visibility:</span>
              <span className="text-gray-800">Verified Contractors Only</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">Subscription Model:</span>
              <span className="text-gray-800">Tier-Based Access</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">Stripe Integration:</span>
              <span className="text-[#22C55E]">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
