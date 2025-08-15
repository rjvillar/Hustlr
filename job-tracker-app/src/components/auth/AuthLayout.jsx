import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import OnboardingButton from "./OnboardingButton";
import OldUser from "./OldUser";
import NewUser from "./NewUser";

const contentVariants = {
  initial: {
    opacity: 0,
    x: -12,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 12,
  },
};

const formVariants = {
  initial: {
    opacity: 0,
    y: 12,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -12,
    scale: 0.98,
  },
};

const subtleTransition = {
  type: "tween",
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.25,
};

function AuthLayout() {
  const location = useLocation();
  const isSignIn = location.pathname.includes("/sign-in");

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-30 p-4 sm:p-0 h-full min-h-[calc(100vh-120px)]">
      <div className="flex flex-col items-center sm:items-start gap-4 sm:gap-2 p-6 sm:p-8 text-center sm:text-left max-w-md sm:max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignIn ? "sign-in" : "sign-up"}
            initial="initial"
            animate="in"
            exit="out"
            variants={contentVariants}
            transition={subtleTransition}
          >
            {isSignIn ? <OldUser /> : <NewUser />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignIn ? "sign-in" : "sign-up"}
            initial="initial"
            animate="in"
            exit="out"
            variants={formVariants}
            transition={subtleTransition}
            className="flex flex-col items-center"
          >
            {isSignIn ? (
              <>
                <LoginForm />
                <OnboardingButton />
              </>
            ) : (
              <>
                <RegisterForm />
                <OnboardingButton />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AuthLayout;
