"use client";

import {
  MdLogout,
  MdMenu,
} from "react-icons/md";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  CalendarCheck,
  HelpCircle,
  History,
  LayoutDashboard,
  LineChart,
  Settings,
  Store,
  User,
  Users,
  Wallet,
} from "lucide-react";

interface ISideBarProps {
  name: string;
  image: string;
}

const navItems = [
  { name: "Overview", icon: <LayoutDashboard size={24} />, path: "/dashboard_overview" },
  { name: "User Management", icon: <User size={24} />, path: "/user_management" },
  { name: "Community & Posts", icon: <Users size={24} />, path: "/posts" },
  { name: "Events", icon: <CalendarCheck size={24} />, path: "/event" },
  { name: "Marketplace", icon: <Store size={24} />, path: "/marketplace" },
  { name: "Business & Vendor Management", icon: <BriefcaseBusiness size={24} />, path: "/business" },
  { name: "Payment & Commissions", icon: <Wallet size={24} />, path: "/payment" },
  { name: "Community Update & Resources", icon: <History size={24} />, path: "/resources" },
  { name: "Support & Moderations", icon: <HelpCircle size={24} />, path: "/support" },
  { name: "Analytics & Insight", icon: <LineChart size={24} />, path: "/analytics" },
  { name: "System Settings", icon: <Settings size={24} />, path: "/settings" },
];

export const Sidebar = ({ name, image }: ISideBarProps) => {
  const [open, setOpen] = useState(false); // Mobile toggle
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => router.push("/");

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-1 mt-4 left-4 z-50 p-2 bg-white/50 backdrop-blur-md rounded"
        onClick={() => setOpen(true)}
      >
        <MdMenu size={28} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50
          transform transition-transform duration-300
          md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="mt-8 px-5 mb-4 relative">
          <p className="font-bold text-lg">Jami Admin</p>

          {/* Close Button on Mobile */}
          <button
            className="md:hidden absolute top-0 right-0 p-2 text-gray-700"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 flex flex-col gap-2 overflow-y-auto h-[calc(100%-160px)]">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                  ${isActive
                    ? "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
                    : "text-gray-800 hover:bg-gray-100"
                  }`}
              >
                {item.icon}
                <span className="text-[15px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 w-full px-4 py-6 border-t border-gray-100">

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
