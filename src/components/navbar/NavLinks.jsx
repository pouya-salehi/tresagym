"use client";
import Link from "next/link";

export default function NavLinks({ onClick, mobile = false }) {
  const links = [
    { href: "/", label: "خانه" },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس" },
  ];

  if (mobile) {
    return (
      <div className="flex flex-row items-center gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClick}
            data-testid={`navlink-${link.label}`}
            className="menu-link text-gray-200 hover:text-cyan-400 transition-colors duration-200"
          >
            {link.label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-8 px-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          data-testid={`navlink-${link.label}`}
          className="menu-link text-gray-200 hover:text-cyan-400 transition-colors duration-200"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
