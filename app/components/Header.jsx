import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white border border-[#6D28D9] px-6 py-4 flex items-center justify-between font-sans">
      <div className="flex items-center shrink-0">
        <img
          src="/logo.png"
          alt="Project Contract Connect Logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      <div className="flex items-center space-x-6 ml-auto">
        <nav className="flex items-center space-x-5 text-sm font-medium">
          <a
            href="#home"
            className="text-[#22C55E] hover:opacity-80 transition-opacity"
          >
            Home
          </a>
          <a
            href="#find-jobs"
            className="text-[#4B5563] hover:text-black transition-colors"
          >
            Find Jobs
          </a>
          <a
            href="#hire-contractors"
            className="text-[#4B5563] hover:text-black transition-colors"
          >
            Hire Contractors
          </a>
          <a
            href="#my-projects"
            className="text-[#4B5563] hover:text-black transition-colors"
          >
            My Projects
          </a>
        </nav>

        <div className="flex items-center space-x-3 text-sm font-medium">
          <button className="bg-[#16A34A] text-white px-5 py-2.5 rounded-full hover:bg-[#15803D] transition-colors shadow-sm">
            Open Admin Dashboard
          </button>

          <button className="border border-[#9CA3AF] text-[#1F2937] px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            Sign in
          </button>

          <Link
            href="/signup"
            className="bg-[#1F2937] text-white px-5 py-2.5 rounded-xl hover:bg-[#111827] transition-colors"
          >
            Join
          </Link>
        </div>
      </div>
    </header>
  );
}
