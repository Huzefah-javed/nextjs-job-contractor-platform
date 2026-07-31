import React, { useState } from "react";

export default function ClientJoin({ handleFormSubmission, stateErrors }) {
  const [companyDocName, setCompanyDocName] = useState("");
  const [repIdDocName, setRepIdDocName] = useState("");

  return (
    <section className="max-w-3xl mx-auto my-12 px-6 py-10 bg-[#FAFAFA] border border-gray-100 rounded-3xl font-sans">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 text-center tracking-wide uppercase mb-8">
        Sign Up to Hire Verified Contractors
      </h2>

      <form
        action={handleFormSubmission}
        className="max-w-2xl mx-auto space-y-5"
        encType="multipart/form-data"
      >
        {/* Row 1: Rep Name & Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Full Name (Representative) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your Name"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
              required
            />
            {stateErrors?.name && (
              <p className="text-red-500 text-xs font-semibold mt-1 pl-1">
                {stateErrors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Your Title / Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="repRole"
              placeholder="e.g. Project Manager, Founder"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
              required
            />
            {stateErrors?.repRole && (
              <p className="text-red-500 text-xs font-semibold mt-1 pl-1">
                {stateErrors.repRole}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Company Name & Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              placeholder="e.g. Prime Build Co."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
              required
            />
            {stateErrors?.companyName && (
              <p className="text-red-500 text-xs font-semibold mt-1 pl-1">
                {stateErrors.companyName}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Company Size <span className="text-red-500">*</span>
            </label>
            <select
              name="companySize"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 text-gray-700"
              required
            >
              <option value="">Select Company Size</option>
              <option value="1-10">1 - 10 employees</option>
              <option value="11-50">11 - 50 employees</option>
              <option value="51-200">51 - 200 employees</option>
              <option value="200+">200+ employees</option>
            </select>
            {stateErrors?.companySize && (
              <p className="text-red-500 text-xs font-semibold mt-1 pl-1">
                {stateErrors.companySize}
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Business Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="companyEmail"
              placeholder="name@company.com"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
              required
            />
            {stateErrors?.email && (
              <p className="text-red-500 text-xs font-semibold mt-1 pl-1">
                {stateErrors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
              required
            />
            {stateErrors?.phone && (
              <p className="text-red-500 text-xs font-semibold mt-1 pl-1">
                {stateErrors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Row 4: Password & Region */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="**********"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
              required
            />
            {stateErrors?.password && (
              <p className="text-red-500 text-xs font-semibold mt-1 pl-1">
                {stateErrors.password}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Primary Region / State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="region"
              placeholder="e.g. California, USA"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
              required
            />
            {stateErrors?.region && (
              <p className="text-red-500 text-xs font-semibold mt-1 pl-1">
                {stateErrors.region}
              </p>
            )}
          </div>
        </div>

        {/* Tax ID */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Tax Identification / Business Reg No.{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="taxId"
            placeholder="e.g. EIN / NTN / Registration Number"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
            required
          />
          {stateErrors?.taxId && (
            <p className="text-red-500 text-xs font-semibold mt-1 pl-1">
              {stateErrors.taxId}
            </p>
          )}
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">
              Company Registration / License{" "}
              <span className="text-red-500">*</span>
            </label>
            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 bg-white rounded-2xl cursor-pointer hover:border-green-500 transition-colors text-center">
              <span className="text-xs text-gray-500 font-medium truncate max-w-[200px]">
                {companyDocName || "Upload Registration PDF/Img"}
              </span>
              <span className="text-[10px] text-gray-400 mt-1">
                PNG, JPG or PDF
              </span>
              <input
                type="file"
                name="companyRegistrationDoc"
                accept="image/*,application/pdf"
                className="hidden"
                required
                onChange={(e) =>
                  setCompanyDocName(e.target.files[0]?.name || "")
                }
              />
            </label>
            {stateErrors?.companyRegistrationDoc && (
              <p className="text-red-500 text-xs font-semibold pl-1">
                {stateErrors.companyRegistrationDoc}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">
              Representative Gov ID / Passport{" "}
              <span className="text-red-500">*</span>
            </label>
            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 bg-white rounded-2xl cursor-pointer hover:border-green-500 transition-colors text-center">
              <span className="text-xs text-gray-500 font-medium truncate max-w-[200px]">
                {repIdDocName || "Upload Representative ID"}
              </span>
              <span className="text-[10px] text-gray-400 mt-1">
                PNG, JPG or PDF
              </span>
              <input
                type="file"
                name="representativeIdDoc"
                accept="image/*,application/pdf"
                className="hidden"
                required
                onChange={(e) => setRepIdDocName(e.target.files[0]?.name || "")}
              />
            </label>
            {stateErrors?.representativeIdDoc && (
              <p className="text-red-500 text-xs font-semibold pl-1">
                {stateErrors.representativeIdDoc}
              </p>
            )}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 pt-3">
          <label className="flex items-start gap-3 cursor-pointer text-xs text-gray-600 select-none leading-relaxed">
            <input
              type="checkbox"
              name="sendUpdates"
              className="mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span>
              Send me platform updates and hiring insights for construction
              projects.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer text-xs text-gray-600 select-none leading-relaxed">
            <input
              type="checkbox"
              name="agreeTerms"
              className="mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
              required
            />
            <span>
              Yes, I agree to the Project Contract Connect Terms of Service,{" "}
              <a
                href="#agreement"
                className="text-green-600 hover:underline font-semibold"
              >
                User Agreement
              </a>
              , and{" "}
              <a
                href="#privacy"
                className="text-green-600 hover:underline font-semibold"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="w-full max-w-xs py-3 bg-[#16A34A] text-white rounded-full font-semibold text-sm hover:bg-[#15803D] transition-colors shadow-sm"
          >
            Create account
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-2">
          Already have an account?{" "}
          <a
            href="#login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login!
          </a>
        </p>
      </form>
    </section>
  );
}
