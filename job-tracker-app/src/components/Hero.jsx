import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Start from "./Start";
import AuthLayout from "./auth/AuthLayout";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -8,
    scale: 1.02,
  },
};

const pageTransition = {
  type: "tween",
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.3,
};

const Hero = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith("/auth");

  return (
    <div className="h-full min-h-[calc(100vh-120px)] bg-white rounded-t-[3rem] overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {!isAuthRoute ? (
          <motion.div
            key="home"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="h-full"
          >
            <Routes>
              <Route path="/" element={<Start />} />
            </Routes>
          </motion.div>
        ) : (
          <div key="auth" className="h-full">
            <Routes>
              <Route path="/auth" element={<AuthLayout />} />
              <Route path="/auth/sign-in" element={<AuthLayout />} />
              <Route path="/auth/sign-up" element={<AuthLayout />} />
            </Routes>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;
