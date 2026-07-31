import React, { useState } from "react";

export default function FreelancerJoin({ handleFormSubmission, stateErrors }) {
  const [docType, setDocType] = useState("gov_id"); // 'gov_id' or 'passport'
  const [frontFileName, setFrontFileName] = useState("");
  const [backFileName, setBackFileName] = useState("");

  return (
    <section className="max-w-3xl mx-auto my-12 px-6 py-10 bg-[#FAFAFA] border border-gray-100 rounded-3xl font-sans">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 text-center tracking-wide uppercase mb-8">
        Join to Access Verified Work
      </h2>

      <form
        action={handleFormSubmission}
        className="max-w-2xl mx-auto space-y-5"
        encType="multipart/form-data"
      >
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Name</label>
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

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
            required
          />
          {stateErrors?.email && (
            <p className="text-red-500 text-xs font-semibold mt-1 pl-1">
              {stateErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Password
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
          <label className="text-sm font-semibold text-gray-700">Country</label>
          <input
            type="text"
            name="country"
            placeholder="United States"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
            required
          />
          {stateErrors?.country && (
            <p className="text-red-500 text-xs font-semibold mt-1 pl-1">
              {stateErrors.country}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Region</label>
          <input
            type="text"
            name="region"
            placeholder="California"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
            required
          />
          {stateErrors?.region && (
            <p className="text-red-500 text-xs font-semibold mt-1 pl-1">
              {stateErrors.region}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Specialization
          </label>
          <input
            type="text"
            name="specialization"
            placeholder="Full stack developer"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
            required
          />
          {stateErrors?.specialization && (
            <p className="text-red-500 text-xs font-semibold mt-1 pl-1">
              {stateErrors.specialization}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 pt-2">
          <label className="text-sm font-semibold text-gray-700">
            Identity Document Type (one of them is mandatory){" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDocType("gov_id")}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                docType === "gov_id"
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              National Govt ID
            </button>
            <button
              type="button"
              onClick={() => setDocType("passport")}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                docType === "passport"
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              Passport
            </button>
          </div>
          <input type="hidden" name="documentType" value={docType} />
        </div>

        {/* Document Number Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            {docType === "gov_id" ? "Government ID Number" : "Passport Number"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="documentNumber"
            placeholder={
              docType === "gov_id" ? "e.g. 42101-1234567-1" : "e.g. A12345678"
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
            required
          />
          {stateErrors?.docNumber && (
            <p className="text-red-500 text-xs font-semibold mt-1 pl-1">
              {stateErrors.docNumber}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">
              {docType === "gov_id"
                ? "Govt ID (Front)"
                : "Passport Page (Front)"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 bg-white rounded-2xl cursor-pointer hover:border-green-500 transition-colors text-center">
              <span className="text-xs text-gray-500 font-medium truncate max-w-[200px]">
                {frontFileName || "Click to upload Front picture"}
              </span>
              <span className="text-[10px] text-gray-400 mt-1">
                PNG, JPG or PDF
              </span>
              <input
                type="file"
                name="documentFront"
                accept="image/*,application/pdf"
                className="hidden"
                required
                onChange={(e) =>
                  setFrontFileName(e.target.files[0]?.name || "")
                }
              />
            </label>
            {stateErrors?.docFrontLink && (
              <p className="text-red-500 text-xs font-semibold pl-1">
                {stateErrors.docFrontLink}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">
              {docType === "gov_id" ? "Govt ID (Back)" : "Passport Info (Back)"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 bg-white rounded-2xl cursor-pointer hover:border-green-500 transition-colors text-center">
              <span className="text-xs text-gray-500 font-medium truncate max-w-[200px]">
                {backFileName || "Click to upload Back picture"}
              </span>
              <span className="text-[10px] text-gray-400 mt-1">
                PNG, JPG or PDF
              </span>
              <input
                type="file"
                name="documentBack"
                accept="image/*,application/pdf"
                className="hidden"
                required
                onChange={(e) => setBackFileName(e.target.files[0]?.name || "")}
              />
            </label>
            {stateErrors?.docBackLink && (
              <p className="text-red-500 text-xs font-semibold pl-1">
                {stateErrors.docBackLink}
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
              Send me important updates about projects, opportunities, and
              platform announcements.
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
              I agree to the Project Contract Connect Terms of Service,{" "}
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
            Create my account
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
