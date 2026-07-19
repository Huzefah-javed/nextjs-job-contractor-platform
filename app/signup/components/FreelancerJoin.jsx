import { userSignupAction } from "@/serverActions/signup";
import React, { useState } from "react";

export default function FreelancerJoin({ handleFormSubmission, stateErrors }) {
  return (
    <section className="max-w-3xl mx-auto my-12 px-6 py-10 bg-[#FAFAFA] border border-gray-100 rounded-3xl font-sans">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 text-center tracking-wide uppercase mb-8">
        Join to Access Verified Work
      </h2>

      <form
        action={handleFormSubmission}
        className="max-w-2xl mx-auto space-y-5"
      >
        <div className="">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your Name"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
              required
            />
          </div>
          {stateErrors?.name && (
            <p className="text-red-500 text-xs font-semibold mt-1.5 pl-1 tracking-wide">
              {stateErrors.name}
            </p>
          )}
        </div>

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
            <p className="text-red-500 text-xs font-semibold mt-1.5 pl-1 tracking-wide">
              {stateErrors.email}
            </p>
          )}
        </div>

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
            <p className="text-red-500 text-xs font-semibold mt-1.5 pl-1 tracking-wide">
              {stateErrors.password}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Country / Region
          </label>
          <input
            type="text"
            name="region"
            placeholder="United States"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
            required
          />
          {stateErrors?.region && (
            <p className="text-red-500 text-xs font-semibold mt-1.5 pl-1 tracking-wide">
              {stateErrors.region}
            </p>
          )}
        </div>

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
                className="green-txt hover:underline font-semibold"
              >
                User Agreement
              </a>
              , and{" "}
              <a
                href="#privacy"
                className="green-txt hover:underline font-semibold"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

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
          <a href="#login" className="green-txt font-semibold hover:underline">
            Login!
          </a>
        </p>
      </form>
    </section>
  );
}
