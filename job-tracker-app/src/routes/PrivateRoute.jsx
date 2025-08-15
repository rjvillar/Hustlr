import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";

const PrivateRoute = ({ children }) => {
  const { user, isLoading, token } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f6fb] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#FCDC73] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#193948] text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
