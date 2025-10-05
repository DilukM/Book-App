"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMutation } from "@apollo/client/react";
import {
  AuthUser,
  LoginCredentials,
  RegisterData,
  SignUpResponse,
  SignInResponse,
  LogoutResponse,
} from "@/types";
import { SIGN_UP, SIGN_IN, LOGOUT } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    data: RegisterData
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [signUpMutation] = useMutation<SignUpResponse>(SIGN_UP);
  const [signInMutation] = useMutation<SignInResponse>(SIGN_IN);
  const [logoutMutation] = useMutation<LogoutResponse>(LOGOUT);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    credentials: LoginCredentials
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const { data } = await signInMutation({
        variables: { input: credentials },
      });

      if (data?.signIn) {
        const { access_token, user: userData } = data.signIn;
        const authUser: AuthUser = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          token: access_token,
        };

        localStorage.setItem("user", JSON.stringify(authUser));
        localStorage.setItem("token", access_token);
        setUser(authUser);
        return { success: true };
      }
      return { success: false, message: "Invalid credentials" };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during login";
      return { success: false, message };
    }
  };

  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        return { success: false, message: "Passwords do not match" };
      }

      const { data: result } = await signUpMutation({
        variables: {
          input: {
            email: data.email,
            password: data.password,
            name: data.name,
          },
        },
      });

      if (result?.signUp) {
        const { access_token, user: userData } = result.signUp;
        const authUser: AuthUser = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          token: access_token,
        };

        localStorage.setItem("user", JSON.stringify(authUser));
        localStorage.setItem("token", access_token);
        setUser(authUser);
        return { success: true };
      }
      return { success: false, message: "Registration failed" };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during registration";
      return {
        success: false,
        message,
      };
    }
  };

  const logout = async () => {
    try {
      await logoutMutation();
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
