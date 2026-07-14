export default function HeroSection() {
  return (
    <div className="max-w-6xl mx-auto my-8 p-8 bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-gray-800 leading-tight">
          Built for Clarity,{" "}
          <span className="text-green-500">Designed for Efficiency</span>
        </h1>

        <h2 className="text-lg font-semibold text-green-500 mt-4">
          Connecting Teams and Clients Through Seamless Communication
        </h2>

        <div className="mt-4 space-y-4 text-gray-600 text-sm leading-relaxed">
          <p>
            Our platform connects professionals and clients with{" "}
            <strong className="text-gray-900">
              readily accessible information
            </strong>
            ,{" "}
            <strong className="text-gray-900">streamlined communication</strong>
            , and <strong className="text-gray-900">real-time updates</strong>.
            From project changes and approvals to managing requirements and
            documentation, everything becomes easier to handle in one
            centralized space.
          </p>
          <p>
            We also understand the challenges of finding consistent work —
            especially during slower seasons. That's why we support{" "}
            <strong className="text-gray-900">ongoing opportunities</strong> by
            enabling{" "}
            <strong className="text-gray-900">
              seamless connections and communication
            </strong>{" "}
            for future approved projects, helping you stay prepared and
            positioned for what's next.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-md">
        <img
          src="/hero.png"
          alt="Hero Illustration"f
          className="w-full object-contain"
        />
      </div>
    </div>
  );
}
