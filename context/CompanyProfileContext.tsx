"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { getPublicCompanyProfile, CompanyProfileData } from "@/lib/api/companyProfile";

const defaultCompanyProfile: CompanyProfileData = {
  phone_number: "+91 9995616166",
  whatsapp_number: "9995616166",
  email: "simaartsindia@gmail.com",
  location_text: "SimaArts Scout & Guide Supplies, Kerala, India",
  location_url: "https://maps.app.goo.gl/EEaWKScbeBcGHxcX8",
  working_hours: "Mon - Sat: 9:00 AM - 6:00 PM",
  facebook_url: "https://facebook.com",
  insta_url: "https://instagram.com",
  youtube_url: "https://youtube.com",
};

interface CompanyProfileContextType {
  profile: CompanyProfileData;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  links: {
    tel: string;
    whatsapp: string;
    mailto: string;
  };
}

const CompanyProfileContext = createContext<CompanyProfileContextType>({
  profile: defaultCompanyProfile,
  loading: true,
  refreshProfile: async () => {},
  links: {
    tel: `tel:${defaultCompanyProfile.phone_number.replace(/\s/g, "")}`,
    whatsapp: `https://wa.me/91${defaultCompanyProfile.whatsapp_number}`,
    mailto: `mailto:${defaultCompanyProfile.email}`,
  },
});

export const CompanyProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<CompanyProfileData>(defaultCompanyProfile);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getPublicCompanyProfile();
      if (res?.data) {
        setProfile({
          phone_number: res.data.phone_number || defaultCompanyProfile.phone_number,
          whatsapp_number: res.data.whatsapp_number || defaultCompanyProfile.whatsapp_number,
          email: res.data.email || defaultCompanyProfile.email,
          location_text: res.data.location_text || defaultCompanyProfile.location_text,
          location_url: res.data.location_url || defaultCompanyProfile.location_url,
          working_hours: res.data.working_hours || defaultCompanyProfile.working_hours,
          facebook_url: res.data.facebook_url || defaultCompanyProfile.facebook_url,
          insta_url: res.data.insta_url || defaultCompanyProfile.insta_url,
          youtube_url: res.data.youtube_url || defaultCompanyProfile.youtube_url,
        });
      }
    } catch (err) {
      console.error("Failed to fetch company profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const links = useMemo(() => {
    const rawPhone = (profile.phone_number || "").replace(/\s/g, "");
    const rawWhatsapp = (profile.whatsapp_number || "").replace(/\D/g, "");
    return {
      tel: `tel:${rawPhone}`,
      whatsapp: `https://wa.me/${rawWhatsapp.length <= 10 ? "91" : ""}${rawWhatsapp}`,
      mailto: `mailto:${profile.email}`,
    };
  }, [profile]);

  return (
    <CompanyProfileContext.Provider
      value={{
        profile,
        loading,
        refreshProfile: fetchProfile,
        links,
      }}
    >
      {children}
    </CompanyProfileContext.Provider>
  );
};

export const useCompanyProfile = () => useContext(CompanyProfileContext);
