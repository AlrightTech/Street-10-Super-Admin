import api, { type ApiResponse } from "../utils/api";

export interface MeUser {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  profileImageUrl: string | null;
  status: string;
  role: string;
  customerType?: string | null;
  lang: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  lang?: string;
  profileImageUrl?: string | null;
}

export const profileApi = {
  getMe: async (): Promise<MeUser> => {
    const response = await api.get<ApiResponse<{ user: MeUser }>>("/users/me");
    return response.data.data.user;
  },

  updateMe: async (data: UpdateProfileData): Promise<MeUser> => {
    const response = await api.patch<ApiResponse<{ user: MeUser }>>(
      "/users/me",
      data
    );
    return response.data.data.user;
  },

  changePassword: async (newPassword: string): Promise<void> => {
    await api.post<ApiResponse<{ message: string }>>("/auth/change-password", {
      newPassword,
    });
  },
};


