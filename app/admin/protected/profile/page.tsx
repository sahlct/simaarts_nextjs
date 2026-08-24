"use client";

import { useEffect, useState } from "react";
import {
  getPublicCompanyProfile,
  updateAdminCompanyProfile,
  CompanyProfileData,
} from "@/lib/api/companyProfile";
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe,
} from "lucide-react";

export default function AdminProfilePage() {
  const [formData, setFormData] = useState<CompanyProfileData>({
    phone_number: "",
    whatsapp_number: "",
    email: "",
    location_text: "",
    location_url: "",
    working_hours: "",
    facebook_url: "",
    insta_url: "",
    youtube_url: "",
  });

  const [initialData, setInitialData] = useState<CompanyProfileData>({
    phone_number: "",
    whatsapp_number: "",
    email: "",
    location_text: "",
    location_url: "",
    working_hours: "",
    facebook_url: "",
    insta_url: "",
    youtube_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getPublicCompanyProfile();
      if (res?.data) {
        const loaded: CompanyProfileData = {
          phone_number: res.data.phone_number || "",
          whatsapp_number: res.data.whatsapp_number || "",
          email: res.data.email || "",
          location_text: res.data.location_text || "",
          location_url: res.data.location_url || "",
          working_hours: res.data.working_hours || "",
          facebook_url: res.data.facebook_url || "",
          insta_url: res.data.insta_url || "",
          youtube_url: res.data.youtube_url || "",
        };
        setFormData(loaded);
        setInitialData(loaded);
      }
    } catch (err: any) {
      console.error("Failed to load profile:", err);
      showToast("Failed to load company profile details", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isChanged = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateAdminCompanyProfile(formData);
      if (res?.success) {
        setInitialData(formData);
        showToast("Company profile details updated successfully!", "success");
      } else {
        showToast(res?.message || "Failed to update profile", "error");
      }
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      showToast(err.message || "Error updating company profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#8C7E4F]" />
          <span className="text-sm font-semibold">Loading Company Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-sm font-semibold transition-all duration-300 animate-in slide-in-from-top-4 ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} className="text-emerald-600" />
          ) : (
            <AlertCircle size={18} className="text-red-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Company Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage contact information, address, working hours, and social links displayed across the public website.
          </p>
        </div>

        {/* Top Save Button: Only shown when fields are modified */}
        {isChanged && (
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-[#4A4229] hover:bg-[#3D3622] text-[#FAF8F3] px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 shrink-0 animate-in fade-in zoom-in-95 duration-200 cursor-pointer"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CONTACT INFORMATION */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold text-[#2C271D] pb-3 border-b border-gray-100">
            <Phone className="w-5 h-5 text-[#8C7E4F]" />
            <span>Contact Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+91 9995616166"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#8C7E4F] outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  placeholder="9995616166"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#8C7E4F] outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="simaartsindia@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#8C7E4F] outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* LOCATION & HOURS */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold text-[#2C271D] pb-3 border-b border-gray-100">
            <MapPin className="w-5 h-5 text-[#8C7E4F]" />
            <span>Location & Working Hours</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Location Address / Text
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <textarea
                  name="location_text"
                  value={formData.location_text}
                  onChange={handleChange}
                  rows={2}
                  placeholder="SimaArts Scout & Guide Supplies, Kerala, India"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#8C7E4F] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Google Maps URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  name="location_url"
                  value={formData.location_url}
                  onChange={handleChange}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#8C7E4F] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Working Hours
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="working_hours"
                  value={formData.working_hours}
                  onChange={handleChange}
                  placeholder="Mon - Sat: 9:00 AM - 6:00 PM"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#8C7E4F] outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SOCIAL MEDIA HANDLES */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold text-[#2C271D] pb-3 border-b border-gray-100">
            <Globe className="w-5 h-5 text-[#8C7E4F]" />
            <span>Social Media Links</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Facebook URL
              </label>
              <div className="relative">
                <Facebook className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  name="facebook_url"
                  value={formData.facebook_url}
                  onChange={handleChange}
                  placeholder="https://facebook.com/simaarts"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#8C7E4F] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Instagram URL
              </label>
              <div className="relative">
                <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  name="insta_url"
                  value={formData.insta_url}
                  onChange={handleChange}
                  placeholder="https://instagram.com/simaarts"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#8C7E4F] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                YouTube URL
              </label>
              <div className="relative">
                <Youtube className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleChange}
                  placeholder="https://youtube.com/@simaarts"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#8C7E4F] outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
