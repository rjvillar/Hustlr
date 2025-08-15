import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { loginUser, registerUser } from "../api.js";

const AuthContext = createContext({
  user: null,
  token: null,
  isNewUser: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isLoading: false,
});

function decodeJWT(token) {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error("Invalid JWT token:", error);
    return null;
  }
}

function isTokenValid(token) {
  if (!token) return false;

  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp || !payload.id) return false;

    const currentTime = Date.now() / 1000;
    const bufferTime = 5 * 60;

    return payload.exp > currentTime + bufferTime;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  const logout = useCallback(() => {
    console.log("Logging out user...");
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
    setIsNewUser(false);
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("authToken");

        if (savedToken && isTokenValid(savedToken)) {
          const payload = decodeJWT(savedToken);

          if (payload && payload.id) {
            setToken(savedToken);
            setUser({
              id: payload.id,
              name: payload.name || "User",
              email: payload.email || "",
            });
            setIsNewUser(false);
            console.log("User authenticated from stored token");
          } else {
            console.log("Invalid token payload, removing...");
            localStorage.removeItem("authToken");
          }
        } else if (savedToken) {
          console.log("Token expired or invalid, removing...");
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("authToken");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = () => {
      if (!isTokenValid(token)) {
        console.log("Token expired, logging out...");
        logout();
      }
    };

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, logout]);

  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      const data = await loginUser(email, password);

      const newToken = data.token || data.authToken;
      const userData = data.user || data;

      if (!newToken) {
        throw new Error("No token received from server");
      }

      if (!isTokenValid(newToken)) {
        throw new Error("Received invalid token from server");
      }

      localStorage.setItem("authToken", newToken);
      setToken(newToken);

      setUser({
        id: userData.id || userData._id,
        name: userData.name || "User",
        email: userData.email || email,
      });

      setIsNewUser(false);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem("authToken");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      setIsLoading(true);
      const data = await registerUser(name, email, password);

      const newToken = data.token || data.authToken;
      const userData = data.user || data;

      if (!newToken) {
        throw new Error("No token received from server");
      }

      if (!isTokenValid(newToken)) {
        throw new Error("Received invalid token from server");
      }

      localStorage.setItem("authToken", newToken);
      setToken(newToken);

      setUser({
        id: userData.id || userData._id,
        name: userData.name || name,
        email: userData.email || email,
      });

      setIsNewUser(true);

      return data;
    } catch (error) {
      console.error("Register error:", error);
      localStorage.removeItem("authToken");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isNewUser,
      login,
      register,
      logout,
      isLoading,
    }),
    [user, token, isNewUser, login, register, logout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
export { AuthProvider };
