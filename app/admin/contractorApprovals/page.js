
export default function ContractorApprovals() {
  return (

<div className="space-y-6 p-8 bg-[#FAFAFA] min-h-screen font-sans text-gray-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Contractor Approvals
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Pending Applications
          </div>
          <div className="text-lg font-bold text-gray-800">8</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Approved This Week
          </div>
          <div className="text-lg font-bold text-gray-800">12</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Rejected
          </div>
          <div className="text-lg font-bold text-gray-800">3</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Under Document Review
          </div>
          <div className="text-lg font-bold text-gray-800">5</div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-[#22C55E]">
                WestGrid Electrical
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#22C55E]"></div>
              </label>
            </div>

            <div className="text-xs font-semibold text-gray-500 space-y-0.5">
              <div>License: CA-EL-458921</div>
              <div>Region: California</div>
            </div>

            <button className="px-5 py-2 bg-[#1E1E1E] text-white text-xs font-bold rounded-full hover:bg-black transition-colors">
              View Documents
            </button>
          </div>

          <div className="flex items-start">
            <span className="inline-block px-4 py-1 bg-[#EAB308] text-white rounded-full text-[10px] font-bold tracking-wide">
              Pending Review
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-[#22C55E]">
                BayArea Construction Group
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#22C55E]"></div>
              </label>
            </div>

            <div className="text-xs font-semibold text-gray-500 space-y-0.5">
              <div>License: CA-GC-772144</div>
              <div>Region: California</div>
            </div>

            <button className="px-5 py-2 bg-[#1E1E1E] text-white text-xs font-bold rounded-full hover:bg-black transition-colors">
              View Documents
            </button>
          </div>

          <div className="flex items-start">
            <span className="inline-block px-4 py-1 bg-[#D97706] text-white rounded-full text-[10px] font-bold tracking-wide">
              Documents Pending
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-[#22C55E]">
                Prime Build Co.
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#22C55E]"></div>
              </label>
            </div>

            <div className="text-xs font-semibold text-gray-500 space-y-0.5">
              <div>License: CA-GC-884210</div>
              <div>Region: California</div>
            </div>

            <button className="px-5 py-2 bg-[#1E1E1E] text-white text-xs font-bold rounded-full hover:bg-black transition-colors">
              View Documents
            </button>
          </div>

          <div className="flex items-start">
            <span className="inline-block px-4 py-1 bg-[#EAB308] text-white rounded-full text-[10px] font-bold tracking-wide">
              License Verification
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
