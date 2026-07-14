"use client";

import React, { useState } from "react";

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState("clients");

  const steps = [
    {
      img: "/postproject.jpg",
      alt: "Post your project",
      title: "Post your project",
    },
    {
      img: "/secureproject.jpg",
      alt: "Secure Project Document Storage",
      title: "Secure Project Document Storage",
    },
    {
      img: "/sidebyside.jpg",
      alt: "Side-by-side proposal comparison",
      title: "Side-by-side proposal comparison",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto my-12 px-6">
      {/* Header Row: Title & Toggle Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold green-txt">How it works</h2>

        {/* Toggle Switch Container */}
        <div className="flex items-center p-1 bg-white border border-gray-200 rounded-full max-w-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("clients")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === "clients"
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            For Clients
          </button>
          <button
            onClick={() => setActiveTab("contractors")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === "contractors"
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            For Contractors
          </button>
        </div>
      </div>

      {/* Steps Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="aspect-[1.5/1] w-full overflow-hidden rounded-2xl">
              <img
                src={step.img}
                alt={step.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-800 leading-tight">
              {step.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
