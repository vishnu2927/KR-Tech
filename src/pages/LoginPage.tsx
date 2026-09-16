import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { I } from "../components/Icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotModal, setForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const loggedUser = await login(email.trim(), password);
      setLoading(false);
      // Admin redirect after login
      if (loggedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Failed to sign in. Please verify your email and password.");
    }
  };

  const handleQuickLogin = async (role: "student" | "admin") => {
    setError("");
    setLoading(true);
    const demoEmail = role === "admin" ? "admin@krtech.com" : "student@krtech.edu";
    const demoPass = role === "admin" ? "admin123" : "password123";
    setEmail(demoEmail);
    setPassword(demoPass);
    try {
      const loggedUser = await login(demoEmail, demoPass);
      setLoading(false);
      if (loggedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Login failed. Please verify credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const loggedUser = await login("student@krtech.edu", "password123");
      setLoading(false);
      navigate("/dashboard");
    } catch {
      setLoading(false);
      setError("Social login: Please sign in with your email or register a new student account.");
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-16 flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white relative overflow-hidden px-4">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-purple-950/50">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-3 text-white no-underline">
              <I.Logo />
              <span className="font-sans font-extrabold text-xl tracking-tight">KR Tech</span>
            </Link>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-white">
              Welcome Back
            </h1>
            <p className="text-xs text-purple-200 mt-1">
              Sign in to access your 1:1 classes, recordings & dashboard
            </p>
          </div>

          {/* Quick Demo Login Switcher */}
          <div className="p-3 mb-6 rounded-2xl bg-purple-900/40 border border-purple-400/20 text-center">
            <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider block mb-2">
              ⚡ Instant Demo Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("student")}
                className="py-2 px-3 rounded-xl text-xs font-bold text-white bg-purple-600/80 hover:bg-purple-600 border border-purple-400/40 transition-all cursor-pointer shadow-xs"
              >
                🎓 Student Portal
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="py-2 px-3 rounded-xl text-xs font-bold text-white bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/40 transition-all cursor-pointer shadow-xs"
              >
                🛡️ Admin Portal
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-purple-200 block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@krtech.edu"
                className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all font-sans"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-purple-200">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-xs text-cyan-300 hover:text-cyan-200 font-medium transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all font-sans"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-purple-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-white/30 bg-white/10 cursor-pointer"
                />
                <span>Remember Me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-900/40 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? "Signing in…" : "Sign In to Platform"}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/15" />
            </div>
            <span className="relative px-3 bg-transparent text-[11px] font-bold text-purple-300 uppercase">
              Or
            </span>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Back to Home & Signup link */}
          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-purple-200">
            <Link to="/" className="text-cyan-300 hover:text-cyan-200 no-underline font-medium flex items-center gap-1">
              ← Back to Home
            </Link>
            <span>
              Don't have an account?{" "}
              <Link to="/signup" className="text-white font-bold hover:underline">
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setForgotModal(false)}
        >
          <div
            className="w-full max-w-md p-6 bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-sans font-bold text-lg mb-2">Reset Password</h3>
            <p className="text-xs text-gray-400 mb-4">
              Enter your registered email address and we will send you a password reset recovery link.
            </p>

            {resetSent ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs text-center mb-4">
                ✓ Reset link dispatched to {resetEmail || "your email"}! Please check your inbox.
              </div>
            ) : (
              <input
                type="email"
                placeholder="name@krtech.edu"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-xs text-white placeholder-gray-500 mb-4 outline-none"
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setForgotModal(false);
                  setResetSent(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
              >
                Close
              </button>
              {!resetSent && (
                <button
                  type="button"
                  onClick={() => setResetSent(true)}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
