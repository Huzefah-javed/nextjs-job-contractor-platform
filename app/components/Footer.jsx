import React from "react";

export default function Footer() {
  const footerLinks = [
    {
      title: "FOR CLIENTS",
      links: ["How to hire", "Document Storage", "Enterprise"],
    },
    {
      title: "FOR CONTRACTORS",
      links: ["How to find work", "Create profile", "Success stories"],
    },
    {
      title: "RESOURCES",
      links: ["Help center", "Blog", "Privacy policy"],
    },
    {
      title: "COMPANY",
      links: ["About", "Security", "Contact"],
    },
  ];

  return (
    <footer className="max-w-6xl mx-auto my-12 p-10 bg-[#1E1E1E] text-gray-400 rounded-3xl text-xs font-sans">
      {/* Top Section: Link Columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10">
        {footerLinks.map((section, idx) => (
          <div key={idx} className="flex flex-col space-y-3">
            <h4 className="text-[10px] font-bold text-gray-200 tracking-wider uppercase">
              {section.title}
            </h4>
            <ul className="space-y-2">
              {section.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Section: Copyright, Socials & Legal */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-neutral-800">
        {/* Copyright */}
        <p className="text-gray-500 order-3 md:order-1">
          © 2026 Project Contract Connect. All rights reserved.
        </p>

        {/* Green Social Icons Block */}
        <div className="flex items-center gap-4 px-4 py-2 bg-green-600 rounded-full text-white order-1 md:order-2">
          {/* WhatsApp */}
          <a href="#" aria-label="WhatsApp" className="hover:opacity-80">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.454L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.01 14.069.99 11.45.989c-5.437 0-9.863 4.371-9.867 9.801 0 1.734.485 3.424 1.402 4.908L1.933 21.83l6.23-1.623z" />
            </svg>
          </a>

          {/* Telegram */}
          <a href="#" aria-label="Telegram" className="hover:opacity-80">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M22.05 1.577c-.39-.39-1.616-.01-3.11.586L2.356 8.94c-1.124.475-1.117 1.104-.207 1.386l4.24 1.325 9.813-6.195c.463-.28.887-.13.538.18l-7.95 7.17-.31 4.636c.454 0 .655-.208.91-.457l2.184-2.122 4.542 3.355c.836.46 1.437.223 1.646-.778l2.96-13.94c.305-1.22-.464-1.774-1.182-1.488z" />
            </svg>
          </a>

          <div className="w-[1px] h-4 bg-green-700/60" />

          {/* YouTube */}
          <a href="#" aria-label="YouTube" className="hover:opacity-80">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.386.507 9.386.507s7.517 0 9.387-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </div>

        {/* Legal Links */}
        <div className="flex items-center gap-6 text-gray-500 order-2 md:order-3">
          <a href="#terms" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#cookie" className="hover:text-white transition-colors">
            Cookie Policy
          </a>
          <a
            href="#accessibility"
            className="hover:text-white transition-colors"
          >
            Accessibility
          </a>
        </div>
      </div>
    </footer>
  );
}
