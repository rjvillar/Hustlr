import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
  forwardRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import assets from "../assets/assets";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  ChartNoAxesGantt,
  LayoutDashboard,
  Info,
  ShieldAlert,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import useAuth from "../hooks/useAuth.js";

function NavbarHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const active = location.pathname.toLowerCase().includes("my-jobs")
    ? "jobs"
    : "dashboard";

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const updateMenuPos = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = 224;
    const gap = 8;
    let left = rect.right - width;
    left = Math.max(8, Math.min(window.innerWidth - 8 - width, left));
    const top = rect.bottom + gap;
    setMenuPos({ top, left });
  };

  useLayoutEffect(() => {
    if (menuOpen) updateMenuPos();
  }, [menuOpen]);

  useEffect(() => {
    const onClick = (e) => {
      const t = e.target;
      if (menuRef.current && menuRef.current.contains(t)) return;
      if (triggerRef.current && triggerRef.current.contains(t)) return;
      setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => menuOpen && updateMenuPos();
    const onScroll = () => menuOpen && updateMenuPos();

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [menuOpen]);

  const spring = { type: "spring", stiffness: 500, damping: 40, mass: 0.7 };

  const segRef = useRef(null);
  const dashRef = useRef(null);
  const jobsRef = useRef(null);
  const [slider, setSlider] = useState({ left: 0, width: 0 });

  const measure = useCallback(() => {
    const container = segRef.current;
    if (!container || container.offsetParent === null) return;
    const btn = active === "jobs" ? jobsRef.current : dashRef.current;
    if (!btn) return;
    const left = btn.offsetLeft;
    const width = btn.offsetWidth;
    setSlider({ left, width });
  }, [active]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  const Item = forwardRef(function Item({ id, icon: Icon, label, to }, ref) {
    const isActive = active === id;
    return (
      <NavLink
        ref={ref}
        to={to}
        aria-current={isActive ? "page" : undefined}
        className="relative z-10 flex-1 inline-flex justify-center items-center px-4 py-2.5 gap-3.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6feb]/40"
      >
        <Icon
          size={18}
          strokeWidth={2.1}
          className={isActive ? "text-[#1f6feb]" : "text-[#193948]"}
        />
        <span
          className={`text-[1rem] font-medium ${
            isActive ? "text-[#193948]" : "text-[#193948]/90"
          }`}
        >
          {label}
        </span>
      </NavLink>
    );
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="z-40 flex items-center justify-between pt-7 pb-4 px-7 sm:px-10 sm:pt-9 relative bg-[#f7f6fb]">
      <img className="w-9" src={assets.logo_colored} alt="Logo" />

      <div
        ref={segRef}
        className="hidden sm:inline-flex relative items-center p-1 rounded-full bg-[#FCDC73]/35 border border-white/60 backdrop-blur-xl shadow-[0_10px_24px_-12px_rgba(0,0,0,0.12)]"
      >
        <motion.span
          aria-hidden
          initial={false}
          animate={{ left: slider.left, width: slider.width }}
          transition={spring}
          className="absolute top-1 bottom-1 rounded-full bg-white border border-white/60 shadow-[0_10px_24px_-12px_rgba(252,220,115,0.65)]"
          style={{ left: slider.left, width: slider.width }}
        />
        <Item
          ref={dashRef}
          id="dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          to="/dashboard"
        />
        <Item
          ref={jobsRef}
          id="jobs"
          icon={BriefcaseBusiness}
          label="My Jobs"
          to="/my-jobs"
        />
      </div>

      <div className="relative">
        <motion.button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={spring}
          className="h-10 w-10 grid place-items-center rounded-full bg-white/80 border border-white/60 text-[#193948] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6feb]/40 cursor-pointer"
        >
          <ChartNoAxesGantt className="text-[#193948]" />
        </motion.button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              ref={menuRef}
              role="menu"
              initial={{ opacity: 0, scale: 0.98, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -4 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="fixed z-[9999] w-56 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.25)] p-1.5"
              style={{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }}
            >
              <button
                role="menuitem"
                onClick={() => {
                  navigate("/dashboard");
                  setMenuOpen(false);
                }}
                className={`sm:hidden w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left focus:outline-none ${
                  active === "dashboard"
                    ? "bg-[#FCDC73]/30"
                    : "hover:bg-black/5 focus:bg-black/5"
                }`}
              >
                <span className="h-8 w-8 grid place-items-center rounded-xl bg-white/90 border border-white/60">
                  <LayoutDashboard
                    className={`h-4.5 w-4.5 ${
                      active === "dashboard"
                        ? "text-[#1f6feb]"
                        : "text-[#193948]"
                    }`}
                  />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#193948]">
                    Dashboard
                  </p>
                  <p className="text-xs text-[#5b6d76]">Overview & stats</p>
                </div>
              </button>

              <button
                role="menuitem"
                onClick={() => {
                  navigate("/my-jobs");
                  setMenuOpen(false);
                }}
                className={`sm:hidden w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left focus:outline-none ${
                  active === "jobs"
                    ? "bg-[#FCDC73]/30"
                    : "hover:bg-black/5 focus:bg-black/5"
                }`}
              >
                <span className="h-8 w-8 grid place-items-center rounded-xl bg-white/90 border border-white/60">
                  <BriefcaseBusiness
                    className={`h-4.5 w-4.5 ${
                      active === "jobs" ? "text-[#1f6feb]" : "text-[#193948]"
                    }`}
                  />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#193948]">My Jobs</p>
                  <p className="text-xs text-[#5b6d76]">Track applications</p>
                </div>
              </button>

              <div className="block sm:hidden my-1 h-px bg-[#e9eef2]" />

              <button
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-black/5 focus:bg-black/5 text-left text-[#193948] focus:outline-none cursor-pointer"
              >
                <span className="h-8 w-8 grid place-items-center rounded-xl bg-white/90 border border-white/60">
                  <Info className="h-4.5 w-4.5 text-[#1f6feb]" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">About</p>
                  <p className="text-xs text-[#5b6d76]">Learn about this app</p>
                </div>
              </button>

              <button
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-black/5 focus:bg-black/5 text-left text-[#193948] focus:outline-none cursor-pointer"
              >
                <span className="h-8 w-8 grid place-items-center rounded-xl bg-white/90 border border-white/60">
                  <ShieldAlert className="h-4.5 w-4.5 text-[#f59e0b]" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Disclaimer</p>
                  <p className="text-xs text-[#5b6d76]">Usage and data notes</p>
                </div>
              </button>

              <div className="my-1 h-px bg-[#e9eef2]" />

              <button
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-black/5 focus:bg-black/5 text-left text-[#193948] focus:outline-none cursor-pointer"
              >
                <span className="h-8 w-8 grid place-items-center rounded-xl bg-white/90 border border-white/60">
                  <SettingsIcon className="h-4.5 w-4.5 text-[#34c759]" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Settings</p>
                  <p className="text-xs text-[#5b6d76]">Preferences & theme</p>
                </div>
              </button>

              <button
                role="menuitem"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-black/5 focus:bg-black/5 text-left text-[#193948] focus:outline-none cursor-pointer"
              >
                <span className="h-8 w-8 grid place-items-center rounded-xl bg-white/90 border border-white/60">
                  <LogOut className="h-4.5 w-4.5 text-[#f44336]" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sign out</p>
                  <p className="text-xs text-[#5b6d76]">End your session</p>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default NavbarHome;
