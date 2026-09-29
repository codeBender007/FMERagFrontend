import { useEffect, useRef, useState } from "react";
import { User, Briefcase, Hash, LogIn, LogOut, Sun, Moon } from "lucide-react";
import { useAuth, useTheme } from "../context";
import LoginPopup from "./LoginPopup";

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  const infoRows = [
    {
      icon: User,
      label: "Name",
      value: isAuthenticated && user?.full_name ? user.full_name : "Guest",
    },
    {
      icon: Briefcase,
      label: "Role",
      value: isAuthenticated && user?.role ? user.role : "User",
    },
    {
      icon: Hash,
      label: "User ID",
      value: isAuthenticated && user?.user_id ? `USER-${user.user_id}` : "N/A",
    },
  ];

  const openLoginPopup = () => {
    setShowProfile(false);
    setShowLogin(true);
  };

  const handleLogout = () => {
    setShowProfile(false);
    logout();
  };

  return (
    <>
      {/* Navbar */}
      <header className="sticky top-0 z-40 flex h-[58px] w-full items-center justify-end gap-3 border-b border-[var(--border-color)] bg-[var(--surface-bg)] px-6 transition-colors duration-200">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? "Switch to light theme" : "Switch to dark theme"}
          aria-label="Toggle theme"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--text-secondary)] shadow-sm transition-all duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] hover:shadow-md active:scale-95"
        >
          {isDark ? (
            <Sun size={18} className="text-amber-400" />
          ) : (
            <Moon size={18} className="text-[#536174]" />
          )}
        </button>

        {/* Profile Container */}
        <div className="relative" ref={containerRef}>
          {/* Profile Button */}
          <button
            type="button"
            aria-label="Profile"
            aria-expanded={showProfile}
            onClick={() => setShowProfile(!showProfile)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-sm transition-all duration-200 hover:bg-[var(--primary-hover)] hover:shadow-md active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="h-[22px] w-[22px]"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
            </svg>
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 top-[calc(100%+10px)] w-[200px] overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] shadow-[var(--shadow-dropdown)] transition-colors duration-200 sm:w-[250px]">
              <div className="px-2 py-2">
                {infoRows.map((row) => {
                  const Icon = row.icon;

                  return (
                    <div
                      key={row.label}
                      className="flex items-center gap-3 rounded-lg px-3 py-2"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--primary-light)] text-[var(--primary)]">
                        <Icon size={15} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                          {row.label}
                        </p>

                        <p className="truncate text-xs font-medium text-[var(--text-primary)]">
                          {row.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Login / Logout Action */}
              <div className="border-t border-[var(--border-subtle)] px-3 py-3">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-9 w-full items-center justify-center gap-2 rounded-md bg-red-500/10 text-sm font-medium text-red-500 transition hover:bg-red-500/20 active:scale-[0.98]"
                  >
                    <LogOut size={15} strokeWidth={2} />
                    Logout
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={openLoginPopup}
                    className="flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-medium text-white shadow-sm transition hover:bg-[var(--primary-hover)] active:scale-[0.98]"
                  >
                    <LogIn size={15} strokeWidth={2} />
                    Login
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <LoginPopup isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default Navbar;
