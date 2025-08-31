import React from "react";
import { ChartNoAxesGantt, X, Info, ShieldAlert, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import assets from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isAuthPage = location.pathname.startsWith("/auth");

  const handleHomeClick = () => {
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/auth/sign-in");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((o) => !o);
  };

  const triggerRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuPos, setMenuPos] = React.useState({ top: 0, left: 0 });

  const updateMenuPos = React.useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = 224;
    const gap = 8;
    let left = rect.right - width;
    left = Math.max(8, Math.min(window.innerWidth - 8 - width, left));
    const top = rect.bottom + gap;
    setMenuPos({ top, left });
  }, []);

  React.useLayoutEffect(() => {
    if (isMenuOpen) updateMenuPos();
  }, [isMenuOpen, updateMenuPos]);

  React.useEffect(() => {
    if (!isMenuOpen) return;

    const onClick = (e) => {
      const t = e.target;
      if (menuRef.current && menuRef.current.contains(t)) return;
      if (triggerRef.current && triggerRef.current.contains(t)) return;
      setIsMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    const onResize = () => updateMenuPos();
    const onScroll = () => updateMenuPos();

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
  }, [isMenuOpen, updateMenuPos]);

  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes dropdownEnter {
        0% {
          opacity: 0;
          transform: scale(0.95) translateY(-8px);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.02) translateY(2px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(10px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-dropdown-enter {
        animation: dropdownEnter 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }

      .animate-fade-in-up-1 {
        animation: fadeInUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        animation-delay: 0.05s;
        opacity: 0;
      }

      .animate-fade-in-up-2 {
        animation: fadeInUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        animation-delay: 0.1s;
        opacity: 0;
      }

      .animate-fade-in-up-3 {
        animation: fadeInUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        animation-delay: 0.15s;
        opacity: 0;
      }
    `;

    if (!document.querySelector("#navbar-styles")) {
      style.id = "navbar-styles";
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.querySelector("#navbar-styles");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return (
    <div className="z-40 flex items-center justify-between py-4 px-7 sm:px-10 sm:pt-9 sm:pb-6 relative">
      <div
        onClick={handleHomeClick}
        className="flex items-center justify-center gap-3 cursor-pointer"
      >
        <img className="w-9" src={assets.logo} alt="" />
        <p className="font-black text-[1.25rem] text-[#193948]">Hustlr</p>
      </div>

      <div className="hidden sm:flex items-center justify-center gap-7">
        <p
          className={`text-[.875rem] font-semibold text-[#214b5f] hover:text-[#193948] cursor-pointer transition-all duration-300 ease-out hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 px-2 py-1 ${
            isAuthPage ? "transform translate-x-[4.5rem]" : ""
          }`}
        >
          About
        </p>
        <p
          className={`text-[.875rem] font-semibold text-[#214b5f] hover:text-[#193948] cursor-pointer transition-all duration-300 ease-out hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 px-2 py-1 ${
            isAuthPage ? "transform translate-x-[4.5rem]" : ""
          }`}
        >
          Disclaimer
        </p>
        <p
          onClick={handleLoginClick}
          className={`text-[.875rem] font-semibold text-[#214b5f] hover:text-[#193948] cursor-pointer transition-all duration-300 ease-out hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 px-2 py-1 ${
            isAuthPage
              ? "opacity-0 scale-95 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
        >
          Sign in
        </p>
      </div>

      <div className="sm:hidden">
        <button
          ref={triggerRef}
          onClick={toggleMenu}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          className="h-10 w-10 grid place-items-center rounded-full bg-white/80 border border-white/60 text-[#193948] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)] transition-transform hover:scale-105 active:scale-95"
        >
          {isMenuOpen ? (
            <X size={20} className="text-gray-800" />
          ) : (
            <ChartNoAxesGantt size={20} className="text-gray-800" />
          )}
        </button>

        <AnimatePresence>
          {isMenuOpen && (
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
                onClick={() => setIsMenuOpen(false)}
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
                onClick={() => setIsMenuOpen(false)}
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

              {!isAuthPage && (
                <>
                  <div className="my-1 h-px bg-[#e9eef2]" />
                  <button
                    role="menuitem"
                    onClick={handleLoginClick}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-black/5 focus:bg-black/5 text-left text-[#193948] focus:outline-none cursor-pointer"
                  >
                    <span className="h-8 w-8 grid place-items-center rounded-xl bg-white/90 border border-white/60">
                      <LogIn className="h-4.5 w-4.5 text-[#193948]" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sign in</p>
                      <p className="text-xs text-[#5b6d76]">
                        Continue to your account
                      </p>
                    </div>
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
