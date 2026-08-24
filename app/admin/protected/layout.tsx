"use client";

import { useState, useEffect, useRef, memo } from "react";
import ProtectedRoute from "@/components/protectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Users,
  GraduationCap,
  BookOpen,
  Video,
  Newspaper,
  Award,
  FolderOpen,
  MessageSquare,
  Star,
  Calendar,
  Globe,
  BarChart3,
  FileText,
  HelpCircle,
  PlayCircle,
  Trophy,
  ClipboardList,
  Menu,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Fan,
  Home,
  LogOut,
} from "lucide-react";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/protected/dashboard",
  },
  {
    name: "Profile",
    icon: User,
    path: "/admin/protected/profile",
  },
  {
    name: "Home",
    icon: Home,
    children: [
      { name: "Users", icon: Users, path: "/admin/protected/users" },
      { name: "Carousel", icon: Fan, path: "/admin/protected/carousel" },
      // { name: "Gallery", icon: Fan, path: "/admin/protected/gallery" },
    ],
  },
  {
    name: "Products",
    icon: GraduationCap,
    // path: "/admin/protected/products",
    children: [
      { name: "Category", icon: ClipboardList, path: "/admin/protected/category" },
      { name: "Sub Category", icon: FolderOpen, path: "/admin/protected/sub-category" },
      { name: "Product", icon: BookOpen, path: "/admin/protected/product" },
    ],
  },
  // {
  //   name: "Services",
  //   icon: BookOpen,
  //   path: "/admin/protected/service",
  // },
  // {
  //   name: "Projects",
  //   icon: FolderOpen,
  //   path: "/admin/protected/projects",
  // },
  {
    name: "Shorts",
    icon: Video,
    path: "/admin/protected/shorts",
  },
  // {
  //   name: "Blogs",
  //   icon: BarChart3,
  //   path: "/admin/protected/blogs",
  // },
  // {
  //   name: "Events",
  //   icon: Star,
  //   path: "/admin/protected/events",
  // },
  {
    name: "Testimonials",
    icon: Award,
    path: "/admin/protected/testimonial",
    // children: [
    //   { name: "Testimonials", icon: Trophy, path: "/admin/protected/testimonial" },
    //   { name: "Customer Stories", icon: GraduationCap, path: "/admin/protected/stories" },
    //   { name: "Careers", icon: GraduationCap, path: "/admin/protected/careers" },
    // ],
  },
  {
    name: "Enquiry's", icon: HelpCircle,
    path: "/admin/protected/enquiry",
    // children: [
    //   { name: "Contact", icon: MessageSquare, path: "/admin/protected/enquiry" },
    //   { name: "Job Applications", icon: MessageSquare, path: "/admin/protected/job-apps" },
    // ],
  },
];

//  Sidebar Component
const Sidebar = memo(
  ({
    pathname,
    isCollapsed,
    toggleSidebar,
    mobileOpen,
    setMobileOpen,
    handleLogout,
  }: {
    pathname: string;
    isCollapsed: boolean;
    toggleSidebar: () => void;
    mobileOpen: boolean;
    setMobileOpen: (v: boolean) => void;
    handleLogout: () => void;
  }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const lastPathRef = useRef(pathname);

    useEffect(() => {
      if (lastPathRef.current === pathname) return;
      lastPathRef.current = pathname;
      const activeParent = menuItems.find((item) =>
        item.children?.some((child) => pathname.startsWith(child.path))
      );
      if (activeParent) setOpenDropdown(activeParent.name);
    }, [pathname]);

    const toggleDropdown = (name: string) => {
      setOpenDropdown((prev) => (prev === name ? null : name));
    };

    return (
      <>
        <aside
          className={`fixed lg:static top-0 left-0 z-40 bg-[#2C271D] text-white border-r border-[#3D3622] transition-all duration-300 flex flex-col 
            ${isCollapsed ? "w-20" : "w-64"} 
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
          style={{ height: "100vh" }}
        >
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-[#3D3622] flex-shrink-0">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="SimaArts"
                className="h-8 w-8 object-contain shrink-0"
              />
              <img
                src="/logo_text.png"
                alt="SimaArts"
                className={`h-6 object-contain ${isCollapsed ? "hidden" : "block"}`}
              />
            </div>
            <button
              onClick={toggleSidebar}
              className="hidden cursor-pointer lg:block text-[#D5C58A] hover:text-white transition-colors"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Scrollable Menu */}
          <nav className="mt-4 px-2 space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
            {menuItems.map((item) => {
              const isActiveParent =
                item.path === pathname ||
                item.children?.some((child) => pathname.startsWith(child.path));

              return item.children ? (
                <div key={item.name}>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`flex items-center justify-between w-full px-3.5 py-3 text-sm font-semibold rounded-xl transition-all duration-200 
                      ${isActiveParent ? "bg-[#D5C58A] text-[#2C271D] font-extrabold shadow-sm" : "text-gray-300 hover:bg-white/10 hover:text-[#D5C58A]"}`}
                  >
                    <div className="flex items-center">
                      <item.icon size={19} className="mr-3 shrink-0" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <span className="cursor-pointer">
                        {openDropdown === item.name ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </span>
                    )}
                  </button>

                  <div
                    className={`ml-6 mt-1 space-y-1 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${openDropdown === item.name && !isCollapsed
                      ? "max-h-60 opacity-100"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        href={child.path}
                        key={child.name}
                        className={`block px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${pathname === child.path
                          ? "bg-[#4A4229] text-[#FAF8F3] font-bold border border-[#D5C58A]/30"
                          : "text-gray-300 hover:bg-white/10 hover:text-[#D5C58A]"
                          }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center px-3.5 py-3 text-sm font-semibold rounded-xl transition-all duration-200 
                    ${pathname === item.path ? "bg-[#D5C58A] text-[#2C271D] font-extrabold shadow-sm" : "text-gray-300 hover:bg-white/10 hover:text-[#D5C58A]"}`}
                >
                  <item.icon size={19} className="mr-3 shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-t border-[#3D3622] mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3.5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-red-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all cursor-pointer bg-white/5"
            >
              <LogOut size={18} className={isCollapsed ? "" : "mr-3"} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </>
    );
  }
);

Sidebar.displayName = "Sidebar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/admin/auth/login");
  };

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF8F3] text-[#2C271D]">
      {/* Mobile Toggle Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#2C271D] border-b border-[#3D3622] flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-[#D5C58A] hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu size={22} />
          </button>
          <span className="font-extrabold text-sm uppercase tracking-wider text-[#D5C58A]">SimaArts Admin</span>
        </div>
        <img src="/logo.png" alt="SimaArts" className="h-7 w-7 object-contain" />
      </div>

      {/* Sidebar */}
      <Sidebar
        pathname={pathname}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        handleLogout={handleLogout}
      />

      {/* Main Content Scrollable */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 lg:mt-0">
        <div className="max-w-7xl mx-auto">
          <ProtectedRoute>{children}</ProtectedRoute>
        </div>
      </main>
    </div>
  );
}
