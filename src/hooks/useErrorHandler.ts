import { toast } from "sonner";
import { useCallback } from "react";
import { ApiError } from "@/lib/api";

/**
 * A hook that provides a standardized way to handle API errors.
 * Automatically shows toasts and can optionally trigger side effects based on status codes.
 */
export const useErrorHandler = () => {
  const handleError = useCallback((error: any, options: { 
    silent?: boolean; 
    on401?: () => void;
    on403?: () => void;
    on404?: () => void;
  } = {}) => {
    const isApiError = error instanceof ApiError;
    const statusCode = isApiError ? error.statusCode : 0;
    const message = error.message || "An unexpected error occurred";

    // Global Side Effects
    if (statusCode === 401) {
      if (options.on401) options.on401();
      // Optional: Redirect to login or clear cache could happen here if not handled by AuthProvider
    } else if (statusCode === 403) {
      if (options.on403) options.on403();
    } else if (statusCode === 404) {
      if (options.on404) options.on404();
    }

    // Toast Notification
    if (!options.silent) {
      if (statusCode >= 500) {
        toast.error("Server Error", {
          description: "Our team has been notified. Please try again later.",
        });
      } else if (statusCode === 429) {
        toast.error("Too Many Requests", {
          description: "Please slow down and try again in a moment.",
        });
      } else {
        toast.error("Request Failed", {
          description: message,
        });
      }
    }

    return {
      message,
      statusCode,
      isOperational: isApiError
    };
  }, []);

  return { handleError };
};
