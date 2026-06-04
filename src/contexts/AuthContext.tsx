import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useProfileNoNavigate } from '../hooks/useAuth';
import { ApiResponse, UserProfileResponse, User } from '../lib/apiTypes';

interface AuthContextType {
  token: string | null; // Kept for compatibility, but we use httpOnly cookies
  userId: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CACHE_KEY = 'connectify_cached_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 1. Initialize with cached data for "Fast-path" hydration
  const [cachedUser, setCachedUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const { data, isLoading, isError, isRefetching } = useProfileNoNavigate();

  const profileData = data as ApiResponse<UserProfileResponse> | undefined;
  const serverUser = profileData?.data?.user || null;

  // 2. Sync server user to cache whenever it changes
  useEffect(() => {
    if (serverUser) {
      setCachedUser(serverUser);
      localStorage.setItem(CACHE_KEY, JSON.stringify(serverUser));
    } else if (!isLoading && isError) {
      // If we're sure there's no user, clear the cache
      setCachedUser(null);
      localStorage.removeItem(CACHE_KEY);
    }
  }, [serverUser, isLoading, isError]);

  // If we have a cached user, we're "authenticated" enough for initial render
  const user = serverUser || cachedUser;
  const userId = user?._id || user?.id || null;
  const isAuthenticated = !!user;
  
  // isLoading is true only if we have NO cached user and the server is still loading
  const isInitialLoading = isLoading && !cachedUser;
  // effectiveIsLoading is for background refreshes
  const effectiveIsLoading = isLoading || isRefetching;

  return (
    <AuthContext.Provider value={{
      token: null,
      userId,
      user,
      isAuthenticated,
      isLoading: effectiveIsLoading,
      isInitialLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
