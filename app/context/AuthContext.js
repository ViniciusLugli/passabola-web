"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api, setAuthToken } from "@/app/lib/api"; // Importar setAuthToken
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const loadUserFromLocalStorage = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          setAuthToken(storedToken);
          const basicUserData = JSON.parse(storedUser);

          // Re-fetch full profile data to ensure it's up-to-date
          const fullProfileData = await fetchFullProfileData(basicUserData);

          setUser({ ...basicUserData, ...fullProfileData });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to load user from local storage:", error);
        logout(); // Limpa qualquer estado inconsistente
      } finally {
        setLoading(false);
      }
    };

    loadUserFromLocalStorage();
  }, [fetchFullProfileData]);

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
      setIsAuthenticated(true);
      router.push("/feed"); // Redireciona para o feed após o login
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login"); // Redireciona para a página de login após o logout
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
