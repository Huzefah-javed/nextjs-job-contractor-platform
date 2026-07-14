import React, { useState } from "react";

export default function FreelancerJoin() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
    sendUpdates: false,
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <section className="max-w-3xl mx-auto my-12 px-6 py-10 bg-[#FAFAFA] border border-gray-100 rounded-3xl font-sans">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 text-center tracking-wide uppercase mb-8">
        Join to Access Verified Work
      </h2>

      {/* Form */}
      <form className="max-w-2xl mx-auto space-y-5">
        {/* Name Row */}
        <div className="">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="**********"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
            required
          />
        </div>

        {/* Country Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Country / Region
          </label>
          <input
            type="text"
            name="country"
            placeholder="United States"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
            required
          />
        </div>

        {/* Checkboxes Wrapper */}
        <div className="space-y-3 pt-3">
          {/* Updates Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer text-xs text-gray-600 select-none leading-relaxed">
            <input
              type="checkbox"
              name="sendUpdates"
              checked={formData.sendUpdates}
              onChange={handleChange}
              className="mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span>
              Send me important updates about projects, opportunities, and
              platform announcements.
            </span>
          </label>

          {/* Terms Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer text-xs text-gray-600 select-none leading-relaxed">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
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

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="w-full max-w-xs py-3 bg-[#16A34A] text-white rounded-full font-semibold text-sm hover:bg-[#15803D] transition-colors shadow-sm"
          >
            Create my account
          </button>
        </div>

        {/* Sign In Footer */}
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
