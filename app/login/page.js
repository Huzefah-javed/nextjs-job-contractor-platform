"use client";

import { loginUserAction } from "@/serverActions/login";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useActionState } from "react";

export default function Login() {
  const [state, formAction, isPending] = useActionState(loginUserAction, {
    success: false,
    errors: {},
    message: "",
  });

  if (state?.success && state?.role) {
    if (state.role === "admin") redirect("/admin/dashboard");
    if (state.role === "client") redirect("/client/dashboard");
    if (state.role === "contractor") redirect("/contractor/dashboard");
  }

  return (
    <section className="max-w-md mx-auto my-16 px-6 py-10 bg-[#FAFAFA] border border-gray-100 rounded-3xl font-sans shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-wide uppercase">
          Welcome Back
        </h2>
        <p className="text-xs text-gray-400 mt-2 font-medium">
          Log in to manage your projects and contracts
        </p>
      </div>

      {state?.message && !state?.success && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <span>{state.message}</span>
        </div>
      )}

      <form action={formAction} suppressHydrationWarning className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
            required
          />
          {state?.errors?.email && (
            <p className="text-red-500 text-xs font-semibold mt-1.5 pl-1 tracking-wide">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">
              Password
            </label>
            <a
              href="#forgot-password"
              className="green-txt text-xs font-bold hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="**********"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 placeholder-gray-300"
            required
          />
          {state?.errors?.password && (
            <p className="text-red-500 text-xs font-semibold mt-1.5 pl-1 tracking-wide">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 select-none">
            <input
              type="checkbox"
              name="rememberMe"
              className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4"
            />
            <span>Remember this device</span>
          </label>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 rounded-full font-semibold text-sm transition-colors shadow-sm ${
              isPending
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[#16A34A] text-white hover:bg-[#15803D]"
            }`}
          >
            {isPending ? "Logging in..." : "Log In"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="green-txt font-semibold hover:underline"
          >
            Sign up now!
          </Link>
        </p>
      </form>
    </section>
  );
}
