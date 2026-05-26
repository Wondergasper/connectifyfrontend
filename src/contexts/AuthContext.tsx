import { createContext, useContext, ReactNode } from 'react';
import { useProfileNoNavigate } from '../hooks/useAuth';
import { ApiResponse, UserProfileResponse } from '../lib/apiTypes';

interface AuthContextType {
  token: string | null; // Kept for compatibility, but we use httpOnly cookies
  userId: string | null;
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isError, isRefetching } = useProfileNoNavigate();

  const profileData = data as ApiResponse<UserProfileResponse> | undefined;

  const user = profileData?.data?.user || null;
  const userId = user?._id || user?.id || null;
  const isAuthenticated = !isLoading && !isError && !!user;
  const effectiveIsLoading = isLoading || isRefetching;

  return (
    <AuthContext.Provider value={{
      token: null, // Tokens are stored in httpOnly cookies, not accessible from JS
      userId,
      user,
      isAuthenticated,
      isLoading: effectiveIsLoading
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
