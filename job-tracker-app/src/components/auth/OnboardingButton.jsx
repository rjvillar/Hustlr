import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OnboardingButton() {
  const location = useLocation();
  const navigate = useNavigate();

  const isSignIn = location.pathname === "/auth/sign-in";

  const handleClick = () => {
    if (isSignIn) {
      navigate("/auth/sign-up");
    } else {
      navigate("/auth/sign-in");
    }
  };

  return (
    <p
      onClick={handleClick}
      className="text-sm font-semibold text-[#193948]/80 hover:text-[#193948] cursor-pointer transition-all duration-300 ease-out hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] hover:scale-102 active:scale-95 px-2 py-1"
    >
      {isSignIn
        ? "Don't have an account? Sign up"
        : "Already have an account? Sign in"}
    </p>
  );
}

export default OnboardingButton;
