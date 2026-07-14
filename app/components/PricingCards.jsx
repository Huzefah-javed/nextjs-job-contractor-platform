import React from "react";

export default function PricingCards() {
  return (
    <section className="max-w-5xl mx-auto my-12 mt-4 px-6">
      {/* Section Title */}
      <h2 className="text-3xl font-bold text-center green-txt mb-12">
        Clients only pay after hiring
      </h2>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Basic Card */}
        <div className="border border-gray-200 rounded-2xl p-8 bg-white flex flex-col justify-between relative">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Basic</h3>
            <p className="text-gray-400 text-sm mt-1">For starting out</p>

            {/* Promo text using your green-txt class */}
            <p className="green-txt font-semibold text-lg mt-6 mb-8">
              5% Service fee after hiring
            </p>

            {/* Features List */}
            <ul className="space-y-4 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gray-800 mt-0.5">✓</span>
                <span>AI-powered project matching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-800 mt-0.5">✓</span>
                <span>Collaboration & milestone tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-800 mt-0.5">✓</span>
                <span>Pay only when work is completed</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button className="w-full mt-8 py-2.5 border border-green-500 rounded-xl green-txt font-medium text-sm hover:bg-green-50 transition-colors">
            Get started for free
          </button>
        </div>

        {/* Business Plus Card (with Green Border & Popular Badge) */}
        <div className="border border-green-500 rounded-2xl p-8 bg-white flex flex-col justify-between relative overflow-hidden">
          {/* Popular Badge */}
          <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] uppercase tracking-wider font-extrabold px-4 py-1.5 rounded-bl-xl">
            Popular
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800">Business Plus</h3>
            <p className="text-gray-400 text-sm mt-1">For growing teams</p>

            {/* Promo text using your green-txt class */}
            <p className="green-txt font-semibold text-lg mt-6 mb-8">
              10% Service fee after hiring
            </p>

            {/* Features List */}
            <ul className="space-y-4 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gray-800 mt-0.5">✓</span>
                <span>Everything in Basic</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-800 mt-0.5">✓</span>
                <span>Priority contractor matching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-800 mt-0.5">✓</span>
                <span>Dedicated account support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-800 mt-0.5">✓</span>
                <span>Team & admin controls</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button className="w-full mt-8 py-2.5 border border-green-500 rounded-xl green-txt font-medium text-sm hover:bg-green-50 transition-colors">
            Get started for free
          </button>
        </div>
      </div>
    </section>
  );
}
