"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/lib/api/product";
import { getCategories } from "@/lib/api/category";
import { getEnquiries } from "@/lib/api/enquiry";
import { getJobs } from "@/lib/api/careers";
import {
  Package,
  Layers,
  HelpCircle,
  Briefcase,
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
        const [productsRes, categoriesRes, enquiriesRes, jobsRes] = await Promise.all([
          getProducts(1, 1),
          getCategories(1, 1),
          getEnquiries(1, 4), // Get 5 for recent list
          getJobs(1, 1),
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
            title: "Career Openings",
            value: jobsRes?.total || 0,
            icon: Briefcase,
            color: "bg-teal-500",
            trend: "Active listings",
            isUp: true,
            path: "/admin/protected/careers"
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/protected/product"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-300 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-md shadow-blue-100"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link href={stat.path || '#'} key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
              <div className={`${stat.color} p-3 rounded-xl text-white transition-transform group-hover:scale-110`}>
                <stat.icon size={24} />
              </div>
              <div className="flex flex-col items-end">
                {stat.trend && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.isUp ? 'text-green-600' : 'text-red-500'}`}>
                    {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{stat.trend.split(' ')[0]}</span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>

              {/* {stat.trend && <p className="text-xs text-gray-400 mt-1">{stat.trend}</p>} */}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Enquiries</h2>
            <Link href="/admin/protected/enquiry" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
              <span>View all</span>
              <ExternalLink size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentEnquiries.length > 0 ? (
                  recentEnquiries.map((enquiry) => (
                    <tr key={enquiry.enquiry_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-800">{enquiry.cstmr_name}</span>
                          <span className="text-xs text-gray-400">{enquiry.cstmr_email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {enquiry.enquiry_type === 1 ? "General" : enquiry.enquiry_type === 2 ? "Product" : "Service"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(enquiry.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${enquiry.enquiry_status === 1 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
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

        {/* Quick Access / System Health */}
        <div className="space-y-6">
          {/* <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">System Status</h3>
              <p className="text-gray-400 text-sm mb-4">Everything is running smoothly. All services are operational.</p>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-green-500 uppercase tracking-widest">Operational</span>
              </div>
              <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-sm font-semibold transition-all border border-white/10">
                Check Analytics
              </button>
            </div>
            <TrendingUp size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
          </div> */}

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Products', path: '/admin/protected/product', icon: Package },
                { name: 'Categories', path: '/admin/protected/category', icon: Layers },
                { name: 'Careers', path: '/admin/protected/careers', icon: Briefcase },
                { name: 'Enquiries', path: '/admin/protected/enquiry', icon: HelpCircle },
                { name: 'Services', path: '/admin/protected/service', icon: BookOpen },
                { name: 'Blogs', path: '/admin/protected/blogs', icon: BarChart3 },
                // { name: 'Testimonials', path: '/admin/protected/testimonial', icon: Trophy },
                // { name: 'Customer Stories', path: '/admin/protected/stories', icon: GraduationCap },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.path}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors group"
                >
                  <item.icon size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors mb-2" />
                  <span className="text-xs font-bold text-gray-700">{item.name}</span>
                </Link>
              ))}
            </div>
            {/* users redirection button */}
            <div className="mt-4">
              <Link href="/admin/protected/users" className="flex items-center justify-center p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors group">
                <Users size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors mb-2" />
                <span className="text-xs font-bold text-gray-700 ms-2">Users</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
