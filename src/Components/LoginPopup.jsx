import { useState } from "react";
import { LogIn, X, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../context";

const LoginPopup = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const { login, isLoading } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setFormError("Please enter both username and password.");
      return;
    }

    setFormError("");
    try {
      await login(username.trim(), password);
      setUsername("");
      setPassword("");
      onClose();
    } catch (err) {
      setFormError(err.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex max-h-screen items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-6">
      {/* Login Box */}
      <form
        onSubmit={handleSubmit}
        className="relative m-auto w-full max-w-[400px] rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5 shadow-[var(--shadow-modal)] transition-colors duration-200 sm:p-6"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
        >
          <X size={17} />
        </button>

        {/* Login Icon */}
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-[0_4px_12px_var(--primary-glow)]">
          <LogIn size={21} />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Welcome back</h2>

        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Login to access your account.
        </p>

        {formError && (
          <div className="mt-3 rounded-lg bg-red-500/10 p-2.5 text-xs text-red-500">
            {formError}
          </div>
        )}

        {/* Username / Email */}
        <div className="mt-6">
          <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Username / Email
          </label>

          <div className="flex h-10 items-center rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] px-3 transition focus-within:border-[var(--primary)]">
            <Mail size={16} className="mr-2 text-[var(--text-muted)]" />

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username or email"
              className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)]"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Password
          </label>

          <div className="flex h-10 items-center rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] px-3 transition focus-within:border-[var(--primary)]">
            <Lock size={16} className="mr-2 text-[var(--text-muted)]" />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)]"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] text-sm font-medium text-white shadow-sm transition hover:bg-[var(--primary-hover)] active:scale-[0.98] disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <LogIn size={16} />
              Login
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginPopup;