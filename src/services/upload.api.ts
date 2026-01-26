import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL or VITE_API_URL must be set in environment variables');
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // Super Admin uses 'authToken' (not 'token')
    return localStorage.getItem('authToken');
  }
  return null;
};

/**
 * Upload a single file to S3
 * 
 * @param file - File object to upload
 * @param folder - Folder path in S3 (products, banners, profiles, documents, categories, vendors, kyc)
 * @returns Promise with S3 URL
 */
export const uploadFileToS3 = async (
  file: File,
  folder: 'products' | 'banners' | 'profiles' | 'documents' | 'categories' | 'vendors' | 'kyc' = 'products'
): Promise<string> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required. Please login first.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (response.data.success && response.data.data?.url) {
      return response.data.data.url;
    }

    throw new Error('Upload failed: Invalid response from server');
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Upload multiple files to S3
 * 
 * @param files - Array of File objects to upload
 * @param folder - Folder path in S3
 * @returns Promise with array of S3 URLs
 */
export const uploadMultipleFilesToS3 = async (
  files: File[],
  folder: 'products' | 'banners' | 'profiles' | 'documents' | 'categories' | 'vendors' | 'kyc' = 'products'
): Promise<string[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required. Please login first.');
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('folder', folder);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload/multiple`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (response.data.success && response.data.data?.files) {
      return response.data.data.files.map((file: any) => file.url);
    }

    throw new Error('Upload failed: Invalid response from server');
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Convert file to Base64 data URL (for preview only)
 * This should NOT be sent to the backend - use uploadFileToS3 instead
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
