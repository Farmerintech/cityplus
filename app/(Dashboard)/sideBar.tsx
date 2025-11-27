"use client";

import {
  MdDashboard,
  MdPerson,
  MdApps,
  MdHistory,
  MdSettings,
  MdSupport,
  MdLogout,
  MdMenu,
} from "react-icons/md";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Dashboard", icon: <MdDashboard size={24} />, path: "/dashboard" },
  { name: "Identity", icon: <MdPerson size={24} />, path: "/identity" },
  { name: "Apps", icon: <MdApps size={24} />, path: "/apps" },
  { name: "History", icon: <MdHistory size={24} />, path: "/history" },
  { name: "Settings", icon: <MdSettings size={24} />, path: "/settings" },
  { name: "Support", icon: <MdSupport size={24} />, path: "/support" },
];

interface ISide_Bar {
  name: string;
  image: string;
}

export const Sidebar = ({ name, image }: ISide_Bar) => {
  const [active, setActive] = useState("/dashboard");
  const [open, setOpen] = useState(false); // mobile toggle
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-1 left-4 z-50 p-2 bg-white/50 backdrop-blur-md rounded"
        onClick={() => setOpen(true)}
      >
        <MdMenu size={28} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50
          transform transition-transform duration-300
          md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="mt-8 px-5 mb-8">
          <p>Jami Admin</p>

          {/* Close Button on Mobile */}
          <button
            className="md:hidden absolute top-4 right-4 text-gray-700"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Nav Items */}
        <nav className="px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setActive(item.path)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${active === item.path
                  ? "bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
                  : "text-gray-800 hover:bg-gray-100"}
              `}
            >
              {item.icon}
              <span className="text-[15px] font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 w-full px-4 py-6 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={image}
              alt="User"
              className="w-9 h-9 rounded-full object-cover border"
            />
            <p className="font-medium text-gray-900">{name}</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-600"
          >
            <MdLogout size={20} />
            <span className="text-[15px] font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
};
