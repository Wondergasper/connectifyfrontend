import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useProfileNoNavigate } from '../hooks/useAuth';
import { ApiResponse, UserProfileResponse } from '../lib/apiTypes';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isError, isRefetching } = useProfileNoNavigate();

  const profileData = data as ApiResponse<UserProfileResponse> | undefined;
  const userId = profileData?.data?.user?._id || null;
  const user = profileData?.data?.user || null;

  const [internalIsAuthenticated, setInternalIsAuthenticated] = useState<boolean>(false);

  // Update authentication status when profile data changes
  useEffect(() => {
    const isAuthenticatedStatus = !isLoading && !isError && !!profileData?.data?.user;
    setInternalIsAuthenticated(isAuthenticatedStatus);
  }, [profileData, isLoading, isError]);

  // Use the internal state instead of calculating every render
  const isAuthenticated = internalIsAuthenticated;

  return (
    <AuthContext.Provider value={{
      token: null,
      userId,
      user,
      isAuthenticated,
      isLoading: isLoading || isRefetching
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
