import api, { type ApiResponse } from '../utils/api';

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

export interface FooterFeature {
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

export interface ContactData {
  phoneNumbers: ContactDetail[];
  email: ContactDetail;
  address: ContactDetail;
  socialMediaLinks: SocialMediaLink[];
}

export interface TermsCondition {
  id: string;
  title: string;
  content: string;
}

export interface ContentData {
  sections: TermsCondition[];
}

export interface AllSettings {
  logos: LogosData;
  contact: ContactData;
  terms: ContentData;
  privacy: ContentData;
  help: ContentData;
  about: ContentData;
}

export const mainControlApi = {
  /**
   * Get all settings
   */
  getAll: async (): Promise<AllSettings> => {
    const response = await api.get<ApiResponse<{ settings: AllSettings }>>('/admin/main-control');
    return response.data.data.settings;
  },

  /**
   * Get settings by key
   */
  getByKey: async (key: 'logos' | 'contact' | 'terms' | 'privacy' | 'help' | 'about'): Promise<any> => {
    const response = await api.get<ApiResponse<{ key: string; data: any }>>(`/admin/main-control/${key}`);
    return response.data.data.data;
  },

  /**
   * Update logos
   */
  updateLogos: async (logos: LogosData): Promise<LogosData> => {
    const response = await api.patch<ApiResponse<{ logos: LogosData }>>('/admin/main-control/logos', logos);
    return response.data.data.logos;
  },

  /**
   * Upload single logo
   */
  uploadLogo: async (type: 'website' | 'app' | 'favicon', url: string): Promise<LogosData> => {
    const response = await api.post<ApiResponse<{ logos: LogosData }>>('/admin/main-control/logos/upload', {
      type,
      url,
    });
    return response.data.data.logos;
  },

  /**
   * Update contact information
   */
  updateContact: async (contact: ContactData): Promise<ContactData> => {
    const response = await api.patch<ApiResponse<{ contact: ContactData }>>('/admin/main-control/contact', contact);
    return response.data.data.contact;
  },

  /**
   * Update terms & conditions
   */
  updateTerms: async (sections: TermsCondition[]): Promise<ContentData> => {
    const response = await api.patch<ApiResponse<{ terms: ContentData }>>('/admin/main-control/terms', {
      sections,
    });
    return response.data.data.terms;
  },

  /**
   * Update privacy policy
   */
  updatePrivacy: async (sections: TermsCondition[]): Promise<ContentData> => {
    const response = await api.patch<ApiResponse<{ privacy: ContentData }>>('/admin/main-control/privacy', {
      sections,
    });
    return response.data.data.privacy;
  },

  /**
   * Update help center
   */
  updateHelp: async (sections: TermsCondition[]): Promise<ContentData> => {
    const response = await api.patch<ApiResponse<{ help: ContentData }>>('/admin/main-control/help', {
      sections,
    });
    return response.data.data.help;
  },

  /**
   * Update about us
   */
  updateAbout: async (sections: TermsCondition[]): Promise<ContentData> => {
    const response = await api.patch<ApiResponse<{ about: ContentData }>>('/admin/main-control/about', {
      sections,
    });
    return response.data.data.about;
  },
};

