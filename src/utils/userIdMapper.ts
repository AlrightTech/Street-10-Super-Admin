import { usersApi } from '../services/users.api';

// Cache for user ID mapping (numeric ID -> UUID)
let userIdMapCache: Map<number, string> | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Converts a numeric user ID to UUID by using a cached mapping
 * @param numericId - The numeric user ID to convert
 * @returns The UUID string or null if not found
 */
export async function convertNumericIdToUuid(numericId: string | number): Promise<string | null> {
  const numeric = typeof numericId === 'string' ? parseInt(numericId) : numericId;
  
  // Check cache validity
  const now = Date.now();
  if (userIdMapCache && (now - cacheTimestamp) < CACHE_DURATION) {
    const uuid = userIdMapCache.get(numeric);
    if (uuid) {
      return uuid;
    }
  }

  // Cache expired or not found, fetch and rebuild cache
  try {
    const usersResult = await usersApi.getAll({
      page: 1,
      limit: 1000,
    });

    if (!usersResult.data || usersResult.data.length === 0) {
      return null;
    }

    // Rebuild cache
    userIdMapCache = new Map<number, string>();
    usersResult.data.forEach((user: any) => {
      try {
        if (user.id && typeof user.id === 'string') {
          const userNumericId =
            parseInt(user.id.replace(/-/g, '').substring(0, 10), 16) % 1000000;
          userIdMapCache!.set(userNumericId, user.id);
        }
      } catch (e) {
        console.error('Error converting user ID:', user.id, e);
      }
    });

    cacheTimestamp = now;
    
    // Return the UUID for the requested numeric ID
    return userIdMapCache.get(numeric) || null;
  } catch (error: any) {
    console.error('Error fetching users for ID mapping:', error);
    return null;
  }
}

/**
 * Clears the user ID mapping cache
 */
export function clearUserIdCache(): void {
  userIdMapCache = null;
  cacheTimestamp = 0;
}
