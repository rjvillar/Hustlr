import React, { useState } from "react";
import { Mail, LockKeyhole } from "lucide-react";
import FormButton from "./FormButton";
import useAuth from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Reset errors
    setEmailError(false);
    setPasswordError(false);
    setEmailFormatError(false);
    setSubmitError("");

    let hasError = false;

    if (!email.trim()) {
      setEmailError(true);
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailFormatError(true);
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setSubmitError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-95 max-w-sm p-5"
      noValidate
    >
      {/* Email field */}
      <div
        className={`relative ${
          emailError || emailFormatError ? "has-error" : ""
        }`}
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Mail size={18} className="text-gray-400" />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#4FADCO]/20 focus:border-[#4FADCO] focus:outline-none transition-all duration-300 ease-out"
        />
      </div>

      {/* Password field */}
      <div className={`relative ${passwordError ? "has-error" : ""}`}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <LockKeyhole size={18} className="text-gray-400" />
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-16 text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#4FADCO]/20 focus:border-[#4FADCO] focus:outline-none transition-all duration-300 ease-out"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#4FADCO] text-sm font-medium hover:text-[#193948] transition-colors duration-200 ease-out z-10"
        >
          Forgot?
        </button>
      </div>

      {submitError && (
        <p className="text-sm text-red-600 mt-1">{submitError}</p>
      )}

      <FormButton disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </FormButton>
    </form>
  );
}

export default LoginForm;
