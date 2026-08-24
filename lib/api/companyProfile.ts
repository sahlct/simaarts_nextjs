import { apiRequest } from "@/lib/api/apiClients";

export interface CompanyProfileData {
  id?: number;
  phone_number: string;
  whatsapp_number: string;
  email: string;
  location_text: string;
  location_url: string;
  working_hours: string;
  facebook_url: string;
  insta_url: string;
  youtube_url: string;
}

export const getPublicCompanyProfile = async () => {
  return apiRequest("/api/company-profile", "GET");
};

export const updateAdminCompanyProfile = async (data: Partial<CompanyProfileData>) => {
  return apiRequest("/api/company-profile", "PUT", data);
};
