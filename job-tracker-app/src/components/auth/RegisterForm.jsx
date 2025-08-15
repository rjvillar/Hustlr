import React, { useState } from "react";
import { Mail, LockKeyhole, User } from "lucide-react";
import FormButton from "./FormButton";
import useAuth from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Reset errors
    setNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setEmailFormatError(false);
    setSubmitError("");

    let hasError = false;

    if (!name.trim()) {
      setNameError(true);
      hasError = true;
    }

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
    } else if (password.length < 8) {
      setPasswordError(true);
      setSubmitError("Password must be at least 8 characters long.");
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (error) {
      setSubmitError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNameFocus = () => {
    if (nameError) setNameError(false);
  };

  const handleEmailFocus = () => {
    if (emailError) setEmailError(false);
    if (emailFormatError) setEmailFormatError(false);
  };

  const handlePasswordFocus = () => {
    if (passwordError) setPasswordError(false);
    if (submitError) setSubmitError("");
  };

  const handleEmailBlur = () => {
    if (email.trim() && !validateEmail(email)) {
      setEmailFormatError(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-95 max-w-sm p-5"
      noValidate
    >
      <div className={`relative ${nameError ? "has-error-required" : ""}`}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <User size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={handleNameFocus}
          placeholder="Name"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-16 text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#4FADCO]/20 focus:border-[#4FADCO] focus:outline-none transition-all duration-300 ease-out hover:bg-gray-100 hover:border-gray-300"
        />
      </div>

      <div
        className={`relative ${emailError ? "has-error-required" : ""} ${
          emailFormatError ? "has-error-format" : ""
        }`}
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Mail size={18} className="text-gray-400" />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleEmailFocus}
          onBlur={handleEmailBlur}
          placeholder="Email"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#4FADCO]/20 focus:border-[#4FADCO] focus:outline-none transition-all duration-300 ease-out hover:bg-gray-100 hover:border-gray-300"
        />
      </div>

      <div className={`relative ${passwordError ? "has-error-required" : ""}`}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <LockKeyhole size={18} className="text-gray-400" />
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={handlePasswordFocus}
          placeholder="Password"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#4FADCO]/20 focus:border-[#4FADCO] focus:outline-none transition-all duration-300 ease-out hover:bg-gray-100 hover:border-gray-300"
        />
      </div>

      {submitError && (
        <p className="text-sm text-red-600 mt-1">{submitError}</p>
      )}

      <FormButton disabled={loading}>
        {loading ? "Creating account..." : "Sign up"}
      </FormButton>
    </form>
  );
}

export default RegisterForm;
