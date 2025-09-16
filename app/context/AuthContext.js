"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { api, setAuthToken } from "@/app/lib/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);
  const router = useRouter();

  const fetchFullProfileData = useCallback(async (basicUserData) => {
    let fullProfileData;
    switch (basicUserData.userType.toLowerCase()) {
      case "player":
        fullProfileData = await api.players.getById(basicUserData.id);
        break;
      case "organization":
        fullProfileData = await api.organizations.getById(basicUserData.id);
        break;
      case "spectator":
        fullProfileData = await api.spectators.getById(basicUserData.id);
        break;
      default:
        console.warn(
          "Unknown user type from localStorage:",
          basicUserData.userType
        );
        fullProfileData = {};
    }
    return fullProfileData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        const basicUserData = JSON.parse(userData);
        setAuthToken(token);

        try {
          const fullProfileData = await fetchFullProfileData(basicUserData);
          setUser({
            ...basicUserData,
            ...fullProfileData,
          });
        } catch (error) {
          console.error("Failed to fetch full user profile on refresh:", error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUserFromStorage();
  }, [fetchFullProfileData, logout]);

  const login = async (credentials) => {
    try {
      const response = await api.auth.login(credentials);
      // A resposta do login agora deve incluir 'id' e 'userType' diretamente
      const { token, profileId, userType, ...basicUserData } = response;

      setAuthToken(token);

      // Usar 'id' e 'userType' da resposta do login
      const userBasicDataWithIdAndType = {
        ...basicUserData,
        id: profileId, // Mapeia profileId para id
        userType: userType,
      };

      const fullProfileData = await fetchFullProfileData(
        userBasicDataWithIdAndType
      );

      const userDataToStore = {
        ...userBasicDataWithIdAndType,
        ...fullProfileData,
      };

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userDataToStore));

      setUser(userDataToStore);

      router.push("/feed");
    } catch (error) {
      console.error("Login failed:", error);
      let errorMessage = "Falha no login. Por favor, tente novamente.";

      if (error) {
        if (
          (error.message && error.message.includes("Invalid credentials")) ||
          (error.status === 400 &&
            error.message &&
            error.message.includes("Bad Request")) ||
          (error.status === 404 &&
            error.message &&
            error.message.includes("Not Found"))
        ) {
          errorMessage = "Conta não existe ou credenciais inválidas.";
        } else if (
          error.details &&
          Array.isArray(error.details) &&
          error.details.length > 0
        ) {
          errorMessage = error.details[0];
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      setLoginErrorMessage(errorMessage);
      throw error;
    }
  };

  const clearLoginError = () => {
    setLoginErrorMessage(null);
  };

  const register = async (userData, role = "player") => {
    try {
      let response;
      switch (role) {
        case "player":
          response = await api.auth.registerPlayer(userData);
          break;
        case "organization":
          response = await api.auth.registerOrganization(userData);
          break;
        case "spectator":
          response = await api.auth.registerSpectator(userData);
          break;
        default:
          throw new Error("Invalid role for registration");
      }
      router.push("/login");
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    register,
    loginErrorMessage,
    clearLoginError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
