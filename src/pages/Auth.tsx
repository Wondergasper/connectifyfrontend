import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Mail, Lock, User, Phone, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { z } from 'zod';
import { loginSchema, registerSchema } from '@/lib/validationSchemas';
import { LoginRequest, RegisterRequest } from '@/lib/apiTypes';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type'); // 'customer' or 'provider'

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',     // For registration
    emailOrPhone: '', // For login (email or phone in one field)
    phone: '',
    password: ''
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const validateForm = () => {
    setErrors({});
    try {
      if (isLogin) {
        loginSchema.parse({
          emailOrPhone: formData.emailOrPhone,
          password: formData.password
        });
      } else {
        registerSchema.parse({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error('Please fix the validation errors');
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // For login, determine if the input is email or phone
        // Sanitize the input to remove extra whitespace and normalize
        const trimmedInput = formData.emailOrPhone.replace(/\s+/g, ' ').trim();
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedInput);
        const loginData: { email?: string; phone?: string; password: string } = {
          password: formData.password.replace(/\s+/g, ' ').trim()
        };

        if (isEmail) {
          loginData.email = trimmedInput;
        } else {
          // Format phone number for consistent API requests
          // Remove any non-digit characters except +
          let phone = trimmedInput.replace(/[^\d+]/g, '');

          // If it starts with '0', replace with +234 for Nigerian numbers
          if (phone.startsWith('0')) {
            phone = '+234' + phone.substring(1);
          } else if (phone.startsWith('234') && !phone.startsWith('+234')) {
            phone = '+' + phone;
          } else if (!phone.startsWith('+')) {
            // If no country code and not starting with 0, assume it's a short format
            // For Nigeria, we might want to prepend country code, but this depends on requirements
          }

          loginData.phone = phone;
        }

        // Log the data being sent for debugging
        console.log('Sending login request with data:', loginData);

        // Call login API
        const response = await api.auth.login(loginData);

        console.log('Login successful:', response);
        toast.success('Login successful!');

        // Check if user already has a role and redirect appropriately
        // The response structure is: { success: true, data: { user: {...} } }
        const userRole = response?.data?.user?.role;
        console.log('User role from response:', userRole);

        // Give a longer delay to ensure cookies are fully set
        await new Promise(resolve => setTimeout(resolve, 300));

        // CRITICAL: Set the user data directly in React Query cache
        // This is BETTER than invalidating because:
        // 1. No extra API call needed (avoids 401 errors)
        // 2. No risk of cookies not being set yet
        // 3. Immediate update to AuthContext
        console.log('📦 Setting user data in cache...');
        queryClient.setQueryData(['profile'], {
          success: true,
          data: {
            user: response.data.user
          }
        });

        console.log('✅ Cache updated with user data');

        // Determine redirect path
        let redirectPath = '/role'; // Default for users without role
        if (userRole === 'customer') {
          redirectPath = '/customer';
        } else if (userRole === 'provider') {
          redirectPath = '/provider';
        }

        console.log('🔄 Redirecting to:', redirectPath);

        // Use replace to prevent going back to login page
        navigate(redirectPath, { replace: true });

        console.log('✅ Navigate called, should redirect now...');
      } else {
        // Sanitize inputs for registration
        const sanitizedName = formData.name.replace(/\s+/g, ' ').trim();
        const sanitizedEmail = formData.email.replace(/\s+/g, ' ').trim();
        const sanitizedPassword = formData.password.replace(/\s+/g, ' ').trim();
        let formattedPhone = formData.phone.replace(/\s+/g, ' ').trim().replace(/[^\d+]/g, '');

        // Format Nigerian phone numbers
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+234' + formattedPhone.substring(1);
        } else if (formattedPhone.startsWith('234') && !formattedPhone.startsWith('+234')) {
          formattedPhone = '+' + formattedPhone;
        }

        // Call register API - both email and phone are required for registration
        const response = await api.auth.register({
          name: sanitizedName,
          email: sanitizedEmail,
          phone: formattedPhone,
          password: sanitizedPassword
        });

        console.log('Registration successful:', response);
        toast.success('Registration successful!');

        // Give a delay to ensure cookies are fully set
        await new Promise(resolve => setTimeout(resolve, 300));

        // CRITICAL: Set the user data directly in React Query cache
        // This ensures AuthContext has the user data before navigating
        console.log('📦 Setting user data in cache after registration...');
        queryClient.setQueryData(['profile'], {
          success: true,
          data: {
            user: response.data.user
          }
        });

        console.log('✅ Cache updated with user data');
        console.log('🔄 Redirecting to role selection...');

        navigate("/role", { replace: true });
      }
    } catch (error: unknown) {
      console.error('Auth error:', error);
      let errorMessage = 'Authentication failed';

      // For fetch API errors, error.message contains the error from api.ts
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'Authentication failed. Please check your credentials.';
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Map the 'email' field id to 'emailOrPhone' during login, keep separate during registration
    const fieldId = (isLogin && id === 'email') ? 'emailOrPhone' : id;

    // Clear the error for this field when user types
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }

    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground">Connectify</h1>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Show user type indicator if coming from CTA */}
          {userType && !isLogin && (
            <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-sm text-center text-foreground">
                {userType === 'customer' ? (
                  <>🎯 <strong>Signing up as a Customer</strong> - Book services & connect with providers</>
                ) : (
                  <>💼 <strong>Signing up as a Provider</strong> - Offer your services & grow your business</>
                )}
              </p>
            </div>
          )}

          {/* Toggle */}
          <div className="flex gap-2 mb-8 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-smooth ${isLogin
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground"
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-smooth ${!isLogin
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground"
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Samuel Adebayo"
                    className={`pl-11 h-12 ${errors.name ? 'border-destructive focus:ring-destructive/20' : 'border-border'} focus:ring-2 focus:ring-primary/20 bg-card`}
                    required={!isLogin}
                  />
                </div>
                {errors.name && (
                  <div className="flex items-center gap-1 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                {isLogin ? "Email or Phone" : "Email Address"}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="text" // Changed to text to allow phone numbers as well for login
                  value={isLogin ? formData.emailOrPhone : formData.email}
                  onChange={handleChange}
                  placeholder={isLogin ? "Email or phone number" : "you@example.com"}
                  className={`pl-11 h-12 ${isLogin ? (errors.emailOrPhone ? 'border-destructive focus:ring-destructive/20' : 'border-border') : (errors.email ? 'border-destructive focus:ring-destructive/20' : 'border-border')} focus:ring-2 focus:ring-primary/20 bg-card`}
                  required={true}
                />
              </div>
              {isLogin && errors.emailOrPhone && (
                <div className="flex items-center gap-1 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.emailOrPhone}</span>
                </div>
              )}
              {!isLogin && errors.email && (
                <div className="flex items-center gap-1 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 800 000 0000"
                    className={`pl-11 h-12 ${errors.phone ? 'border-destructive focus:ring-destructive/20' : 'border-border'} focus:ring-2 focus:ring-primary/20 bg-card`}
                    required={!isLogin}
                  />
                </div>
                {errors.phone && (
                  <div className="flex items-center gap-1 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`pl-11 h-12 ${errors.password ? 'border-destructive focus:ring-destructive/20' : 'border-border'} focus:ring-2 focus:ring-primary/20 bg-card`}
                  required
                />
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold gradient-primary border-0 hover:opacity-90 transition-smooth shadow-medium mt-6"
            >
              {loading ? "Processing..." : (isLogin ? "Continue" : "Create Account")}
            </Button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                className="h-12 bg-card hover:bg-muted border-border"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 bg-card hover:bg-muted border-border"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Apple
              </Button>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground mt-8 leading-relaxed">
            By continuing, you agree to our{" "}
            <button onClick={() => navigate('/terms')} className="text-primary hover:underline">Terms of Service</button>
            {" "}and{" "}
            <button onClick={() => navigate('/privacy')} className="text-primary hover:underline">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div >
  );
};

export default Auth;
