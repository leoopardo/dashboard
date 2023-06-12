import React, { createContext, useState, useContext } from "react";
import { User } from "../../types/User";
import { api } from "../../config/api";

interface LoginData {
  username: string;
  password: string;
}

interface AuthContextData {
  signIn(data: LoginData, rememberMe: boolean): Promise<{ data: User }>;
  signOut(): Promise<void>;
  signInByStorage(): Promise<boolean>;
  token: string | undefined;
  user: User | undefined;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | undefined>();
  const [token, setToken] = useState<string | undefined>();

  async function signIn(data: LoginData, rememberMe: boolean) {
    signOut();
    const response = await api.post(
      "core/token",
      {},
      {
        auth: data,
      }
    );
    const userToken = response.data.token;

    if (rememberMe) {
      localStorage.setItem("token", userToken);
    }
    sessionStorage.setItem("token", userToken);
    setToken(userToken);
    return validateUser(userToken);
  }

  async function validateUser(userToken: string) {
    const userData = await api.get("core/token/validate", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    setUser(userData.data);
    return userData;
  }

  async function signInByStorage(): Promise<boolean> {
    if (!localStorage.getItem("token") && !sessionStorage.getItem("token"))
      return false;
    const userToken = `${
      localStorage.getItem("token") || sessionStorage.getItem("token")
    }`;

    api.interceptors.request.use(async (config) => {
      const t = userToken;

      if (t) {
        api.defaults.headers.Authorization = `Bearer ${
          localStorage.getItem("token") || sessionStorage.getItem("token")
        }`;
      }

      return config;
    });

    setToken(userToken);
    let success;
    try {
      await validateUser(userToken);
      success = true;
    } catch (error) {
      success = false;
      signOut();
    }
    return success;
  }

  async function signOut() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(undefined);
    setToken(undefined);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, signIn, signOut, signInByStorage }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
