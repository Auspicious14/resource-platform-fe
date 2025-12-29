"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import { FormikHelpers } from "formik";
import { AxiosClient } from "../../components";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie } from "@/helper";

export interface AuthContextType {
  user: any;
  isLoading: boolean;
  error: string | null;
  signUp: (values: any, actions: FormikHelpers<any>) => Promise<void>;
  signIn: (values: any, actions: FormikHelpers<any>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  signUp: async () => {},
  signIn: async () => {},
  forgotPassword: async () => {},
  refreshUser: async () => {},
  setUser: () => {},
  logout: async () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    const token =
      localStorage.getItem("token") || document.cookie.includes("token=");
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await AxiosClient.get("/auth/me");
      if (response.data?.success) {
        setUser(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleAuthRequest = async (
    url: string,
    values: any,
    type: "signup" | "signin"
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AxiosClient.post(url, values);
      if (response?.data) {
        const data = response?.data?.data;
        if (type === "signin") {
          setUser(data);
          localStorage.setItem("token", data?.token);
          setCookie("token", data?.token, 7);
          toast.success("Success!");
        }
        router.push(
          type === "signup"
            ? "/signin"
            : `${data?.role === "ADMIN" ? "/admin" : "/dashboard"}`
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(err.response?.data?.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = useCallback(
    async (values: any, actions: FormikHelpers<any>) => {
      await handleAuthRequest("/auth/register", values, "signup");
      actions.setSubmitting(false);
    },
    []
  );

  const signIn = useCallback(
    async (values: any, actions: FormikHelpers<any>) => {
      await handleAuthRequest("/auth/login", values, "signin");
      actions.setSubmitting(false);
    },
    []
  );

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await AxiosClient.post("/auth/forgetPassword", { email });
      toast.success("Password reset email sent");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = async () => {
    setIsLoading(true);
    try {
      await AxiosClient.post("/auth/logout");
      setUser(null);
      localStorage.removeItem("token");
      deleteCookie("token", -1);
      toast.success("Logged out successfully");
      router.push("/");
    } catch (err: any) {
      console.error("Logout failed", err);
      // Even if the server call fails, we should clear local state
      setUser(null);
      localStorage.removeItem("token");
      deleteCookie("token", -1);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signUp,
        signIn,
        forgotPassword,
        refreshUser: fetchUser,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
