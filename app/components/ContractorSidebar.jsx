"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function ContractorSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/contractor/dashboard" },
    { label: "Escrow  pendings", href: "/contractor/escrowPendings" },
    { label: "find Jobs", href: "/contractor/exploreJobs" },
    { label: "chats", href: "/contractor/chats" },
  ];

  const clients = [
    {
      name: "Michael Harper",
      role: "Commercial Property Manager",
      image: "/clients/michael.jpg",
    },
    {
      name: "Olivia Bennett",
      role: "Real Estate Investor",
      image: "/clients/olivia.jpg",
    },
  ];

  return (
    <aside className="flex-[25%] h-screen sticky top-0 bg-white border-r border-gray-100 flex flex-col justify-between px-6 py-8 font-sans overflow-y-auto">
      <div className="flex flex-col gap-8">
        <div className="space-y-5">
          <div className="text-gray-500 text-xs font-bold tracking-wider uppercase pl-2">
            Contractor Panel
          </div>

          <nav className="flex flex-col gap-5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold pl-2 transition-colors ${
                    isActive
                      ? "text-[#22C55E]"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <div className="text-gray-500 text-xs font-bold tracking-wider uppercase pl-2">
            Contractors
          </div>

          <div className="flex flex-col gap-4 pl-2">
            <Link
              href="/contractor/field-representatives"
              className={`text-sm font-semibold transition-colors ${
                pathname === "/contractor/field-representatives"
                  ? "text-[#22C55E]"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Field Representatives
            </Link>

            <Link
              href="/contractor/add-representative"
              className="text-xs font-bold text-gray-300 hover:text-gray-400 transition-colors flex items-center gap-1"
            >
              <span>+</span> Add Representative
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-gray-500 text-xs font-bold tracking-wider uppercase pl-2">
            Clients
          </div>

          <div className="flex flex-col gap-4 pl-2">
            {clients.map((client, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={client.image}
                    alt={client.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 leading-tight">
                    {client.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {client.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 pt-8">
        <div className="text-gray-500 text-xs font-bold tracking-wider uppercase pl-2">
          Settings
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/contractor/settings"
            className={`flex items-center gap-2 text-sm font-semibold pl-2 transition-colors ${
              pathname === "/contractor/settings"
                ? "text-[#22C55E]"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.99l1.005.831a1.125 1.125 0 01.26 1.43l-1.297 2.247a1.125 1.125 0 01-1.37.491l-1.216-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.831a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Settings</span>
          </Link>

          <button className="flex items-center gap-2 text-sm font-semibold pl-2 text-[#EF4444] hover:text-red-700 transition-colors w-full text-left">
            <svg
              className="w-4 h-4 flex-shrink-0 rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
