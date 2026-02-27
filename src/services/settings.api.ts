import axios from 'axios';

export interface LogosData {
  websiteLogo: string | null;
  appLogo: string | null;
  favicon: string | null;
}

export interface ContactDetail {
  id: string;
  label: string;
  value: string;
}

export interface SocialMediaLink {
  id: string;
  name: string;
  icon: string;
  url: string;
}

export interface FooterFeature {
  id: string;
  title: string;
  link: string;
}

export interface ContactData {
  phoneNumbers: ContactDetail[];
  email: ContactDetail;
  address: ContactDetail;
  footerOneFeatures: FooterFeature[];
  footerTwoFeatures: FooterFeature[];
  socialMediaLinks: SocialMediaLink[];
}

export interface PublicSettings {
  logos: LogosData;
  contact: ContactData;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error(
    "Missing VITE_API_BASE_URL. Set it in Super-Admin .env (e.g. https://api.st10.info/api/v1)."
  );
}

export const settingsApi = {
  /**
   * Get public settings (logos and contact info) - no auth required
   */
  getPublicSettings: async (): Promise<PublicSettings> => {
    const response = await axios.get<{ success: boolean; data: PublicSettings }>(
      `${API_BASE_URL}/public/main-control`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    return response.data.data;
  },
};

