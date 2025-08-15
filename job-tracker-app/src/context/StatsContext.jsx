import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
  useStats,
} from "react";
import useAuth from "../hooks/useAuth";
import { getStats } from "../api";

const StatsContext = createContext({
  stats: null,
  loading: false,
  error: null,
  refreshStats: () => {},
});

export function StatsProvider({ children }) {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    if (!token) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getStats(token);
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setError(error.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  const refreshStats = () => {
    fetchStats();
  };

  const value = useMemo(
    () => ({
      stats,
      loading,
      error,
      refreshStats,
    }),
    [stats, loading, error]
  );

  return (
    <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return context;
}

export default StatsContext;
