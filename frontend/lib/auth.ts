import api from "./api";
import { toast } from "sonner";

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    token: {
      access: string;
      refresh: string;
    };
  };
  error?: string;
  errors?: any;
  token?: {
    access: string;
    refresh: string;
  };
  user?: any;
}

export const registerUser = async (userData: any): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/register/", userData);
    if (response.data.success) {
      toast.success(response.data.message);
      // Store tokens and user data in localStorage
      localStorage.setItem("accessToken", response.data.data.tokens.access);
      localStorage.setItem("refreshToken", response.data.data.tokens.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    } else {
      toast.error(response.data.message);
    }
    return response.data;
  } catch (error: any) {
    toast.error("Registration failed: " + (error.response?.data?.message || error.message));
    return { success: false, message: error.response?.data?.message || error.message, errors: error.response?.data?.errors };
  }
};

export const loginUser = async (credentials: any): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login/", credentials);
    if (response.data.message === "Login Successful") {
      toast.success(response.data.message);
      // Store tokens and user data in localStorage
      localStorage.setItem("accessToken", response.data.token.access);
      localStorage.setItem("refreshToken", response.data.token.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } else {
      toast.error(response.data.message);
    }
    return response.data;
  } catch (error: any) {
    toast.error("Login failed: " + (error.response?.data?.error || error.message));
    return { success: false, message: error.response?.data?.error || error.message, error: error.response?.data?.error };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  toast.info("Logged out successfully.");
};

export const getAccessToken = (): string | null => {
  return typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
};

export const getRefreshToken = (): string | null => {
  return typeof window !== 'undefined' ? localStorage.getItem("refreshToken") : null;
};

export const getUser = (): any | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
