import React from "react";

export default function VerifiedContractors() {
  const categories = [
    {
      title: "General Contracting",
      desc: "Full-service residential and commercial project management including renovations and new builds.",
    },
    {
      title: "Electrical",
      desc: "Licensed electricians for installations, upgrades, inspections, and maintenance projects.",
    },
    {
      title: "Plumbing",
      desc: "Certified plumbing professionals for repairs, installations, and large-scale systems.",
    },
    {
      title: "HVAC",
      desc: "Heating, ventilation, and air conditioning specialists for residential and commercial needs.",
    },
    {
      title: "Roofing",
      desc: "Roof installation, repair, and inspection services from verified contractors.",
    },
    {
      title: "Commercial Construction",
      desc: "Large-scale commercial builds, tenant improvements, and industrial projects.",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto my-12 px-6">
      {/* Title with your custom green-txt class */}
      <h2 className="text-3xl font-bold green-txt mb-8">
        Explore verified contractors
      </h2>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((item, idx) => (
          <div
            key={idx}
            className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
