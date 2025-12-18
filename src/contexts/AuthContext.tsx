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

// Utility function to extract token from cookies
const getTokenFromCookie = (): string | null => {
  try {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
    if (tokenCookie) {
      const tokenValue = tokenCookie.split('=')[1];
      return tokenValue ? decodeURIComponent(tokenValue) : null;
    }
    return null;
  } catch (error) {
    console.error('Error extracting token from cookie:', error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isError, refetch, isRefetching } = useProfileNoNavigate();

  const profileData = data as ApiResponse<UserProfileResponse> | undefined;
  const userId = profileData?.data?.user?._id || null;
  const user = profileData?.data?.user || null;

  // State for JWT token and authentication
  const [token, setToken] = useState<string | null>(null);
  const [internalIsAuthenticated, setInternalIsAuthenticated] = useState<boolean>(false);

  // Extract token from cookies when profile data changes
  useEffect(() => {
    if (profileData?.data?.user) {
      const extractedToken = getTokenFromCookie();
      setToken(extractedToken);
    } else {
      setToken(null);
    }
  }, [profileData]);

  // Update authentication status when profile data changes
  useEffect(() => {
    const isAuthenticatedStatus = !isLoading && !isError && !!profileData?.data?.user;
    setInternalIsAuthenticated(isAuthenticatedStatus);
  }, [profileData, isLoading, isError]);

  // Use the internal state instead of calculating every render
  const isAuthenticated = internalIsAuthenticated;

  return (
    <AuthContext.Provider value={{
      token, // Now providing the actual JWT token for WebSocket authentication
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