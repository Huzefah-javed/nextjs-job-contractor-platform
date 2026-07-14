"use client";

import { useState } from "react";

export default function JoinRoleSelection({ setSelectedRole }) {
  const [role, setRole] = useState(null);

  function handleSubmit() {
    setSelectedRole(role);
  }

  return (
    <section className="max-w-4xl mx-auto my-16 px-6 flex flex-col items-center justify-center font-sans">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 text-center tracking-wide uppercase mb-10">
        Join as a Client or <br className="sm:hidden" /> Contractor
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mb-8">
        <div
          onClick={() => setRole("freelancer")}
          className={`cursor-pointer p-6 border-2 rounded-2xl bg-white flex flex-col justify-between transition-all duration-200 h-44 relative ${
            role === "freelancer"
              ? "border-green-500 shadow-md scale-[1.02]"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex justify-between items-start">
            <svg
              className="w-10 h-10 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83m-4.75 4.75l-4.75-4.75M11.42 15.17l4.75-4.75M11.42 15.17L7.25 11M16.17 10.42L21 5.58A2.652 2.652 0 0017.25 1.83l-4.83 4.83m4.75 4.75l-4.75-4.75M16.17 10.42l-4.75 4.75M16.17 10.42L11 16.17m-4.75-4.75L1.83 17.25A2.652 2.652 0 005.58 21l4.83-4.83m-4.75-4.75l4.75 4.75M6.42 11.42l4.75-4.75"
              />
            </svg>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                role === "freelancer" ? "border-green-500" : "border-gray-300"
              }`}
            >
              {role === "freelancer" && (
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 leading-tight">
            I'm a Contractor, <br /> looking for work
          </h3>
        </div>

        <div
          onClick={() => setRole("client")}
          className={`cursor-pointer p-6 border-2 rounded-2xl bg-white flex flex-col justify-between transition-all duration-200 h-44 relative ${
            role === "client"
              ? "border-green-500 shadow-md scale-[1.02]"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          {/* Top Row: Icon & Radio Circle */}
          <div className="flex justify-between items-start">
            {/* Client Icon (SVG) */}
            <svg
              className="w-10 h-10 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>

            {/* Custom Radio Circle */}
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                role === "client" ? "border-green-500" : "border-gray-300"
              }`}
            >
              {role === "client" && (
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              )}
            </div>
          </div>

          {/* Text Description */}
          <h3 className="text-xl font-bold text-gray-800 leading-tight">
            I'm a client, hiring <br /> for a project
          </h3>
        </div>
      </div>

      <button
        disabled={!role}
        onClick={handleSubmit}
        className={`w-full max-w-xs py-3 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm ${
          role
            ? "bg-green-800 text-white hover:bg-green-900 cursor-pointer"
            : "bg-[#A3A3A3] text-white cursor-not-allowed"
        }`}
      >
        Create Account
      </button>

      {/* Redirect Footer */}
      <p className="mt-4 text-xs text-gray-400">
        Already have an account?{" "}
        <a href="#login" className="green-txt font-semibold hover:underline">
          Login!
        </a>
      </p>
    </section>
  );
}
