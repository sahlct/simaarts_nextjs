"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/lib/api/product";
import { getCategories } from "@/lib/api/category";
import { getEnquiries } from "@/lib/api/enquiry";
import { getProjects } from "@/lib/api/projects";
import {
  Package,
  Layers,
  HelpCircle,
  Briefcase,
  FolderOpen,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ExternalLink,
  Plus,
  BookOpen,
  BarChart3,
  Users
} from "lucide-react";
import Link from "next/link";
import path from "path";

interface StatItem {
  title: string;
  value: number | string;
  icon: any;
  color: string;
  trend?: string;
  isUp?: boolean;
  path?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, enquiriesRes, projectsRes] = await Promise.all([
          getProducts(1, 1),
          getCategories(1, 1),
          getEnquiries(1, 4), // Get 5 for recent list
          getProjects(1, 1),
        ]);

        const dashboardStats: StatItem[] = [
          {
            title: "Products",
            value: productsRes?.total || 0,
            icon: Package,
            color: "bg-blue-500",
            trend: "+12% from last month",
            isUp: true,
            path: "/admin/protected/product"
          },
          {
            title: "Categories",
            value: categoriesRes?.total || 0,
            icon: Layers,
            color: "bg-purple-500",
            trend: "+2 new added",
            isUp: true,
            path: "/admin/protected/category"
          },
          {
            title: "Enquiries",
            value: enquiriesRes?.total || 0,
            icon: HelpCircle,
            color: "bg-orange-500",
            trend: "+5 today",
            isUp: true,
            path: "/admin/protected/enquiry"
          },
          {
            title: "Projects",
            value: projectsRes?.total || 0,
            icon: FolderOpen,
            color: "bg-teal-500",
            trend: "Active",
            isUp: true,
            path: "/admin/protected/projects"
          },
        ];

        setStats(dashboardStats);
        setRecentEnquiries(enquiriesRes?.data || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A4229]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2C271D] tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/protected/product"
            className="flex items-center gap-2 bg-[#4A4229] hover:bg-[#3D3622] text-[#FAF8F3] px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link href={stat.path || '#'} key={i} className="bg-white p-6 rounded-2xl border border-[#EAE4D3] shadow-xs hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
              <div className="bg-[#4A4229] p-3 rounded-xl text-[#FAF8F3] transition-transform group-hover:scale-110 shadow-xs">
                <stat.icon size={22} />
              </div>
              <div className="flex flex-col items-end">
                {stat.trend && (
                  <div className={`flex items-center gap-1 text-xs font-semibold ${stat.isUp ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{stat.trend.split(' ')[0]}</span>
                  </div>
                )}
                <h3 className="text-2xl font-black text-[#2C271D] mt-1">{stat.value}</h3>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#8C7E4F]">{stat.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EAE4D3] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#EAE4D3] flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#2C271D]">Recent Enquiries</h2>
            <Link href="/admin/protected/enquiry" className="text-xs font-bold text-[#8C7E4F] hover:text-[#4A4229] hover:underline flex items-center gap-1 uppercase tracking-wider">
              <span>View all</span>
              <ExternalLink size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FAF8F3] text-[10px] font-black text-[#857A68] uppercase tracking-wider">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentEnquiries.length > 0 ? (
                  recentEnquiries.map((enquiry) => (
                    <tr key={enquiry.enquiry_id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#2C271D]">{enquiry.cstmr_name}</span>
                          <span className="text-xs text-[#5A5243] font-medium">{enquiry.cstmr_email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-[#5A5243]">
                        {enquiry.enquiry_type === 1 ? "General" : enquiry.enquiry_type === 2 ? "Product" : "Service"}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-[#5A5243]">
                        {new Date(enquiry.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${enquiry.enquiry_status === 1 ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}>
                          {enquiry.enquiry_status === 1 ? "Pending" : "Closed"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic text-sm">
                      No recent enquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Access */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EAE4D3] shadow-xs">
            <h3 className="text-xs font-black text-[#8C7E4F] mb-4 uppercase tracking-widest">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Products', path: '/admin/protected/product', icon: Package },
                { name: 'Categories', path: '/admin/protected/category', icon: Layers },
                { name: 'Projects', path: '/admin/protected/projects', icon: FolderOpen },
                { name: 'Enquiries', path: '/admin/protected/enquiry', icon: HelpCircle },
                { name: 'Services', path: '/admin/protected/service', icon: BookOpen },
                { name: 'Blogs', path: '/admin/protected/blogs', icon: BarChart3 },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.path}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#EAE4D3] bg-[#FAF8F3] hover:bg-white hover:border-[#D5C58A] transition-all group shadow-2xs"
                >
                  <item.icon size={20} className="text-[#8C7E4F] group-hover:scale-110 transition-transform mb-2" />
                  <span className="text-xs font-extrabold text-[#2C271D]">{item.name}</span>
                </Link>
              ))}
            </div>
            {/* users redirection button */}
            <div className="mt-3">
              <Link href="/admin/protected/users" className="flex items-center justify-center p-3 rounded-xl border border-[#EAE4D3] bg-[#FAF8F3] hover:bg-white hover:border-[#D5C58A] transition-all group shadow-2xs">
                <Users size={18} className="text-[#8C7E4F] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-extrabold text-[#2C271D] ms-2">Users</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
