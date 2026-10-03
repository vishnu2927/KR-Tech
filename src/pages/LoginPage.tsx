import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/common/SEO";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<"student" | "admin">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError === "google_not_configured") {
      setError("Google OAuth is not configured on this server. Please use email and password.");
    } else if (oauthError === "email_not_verified") {
      setError("Your Google account email is unverified. Please verify your Google email first.");
    } else if (oauthError) {
      setError("Google authentication failed. Please use standard email and password.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const loggedUser = await login(email.trim(), password, rememberMe);
      setLoading(false);
      if (loggedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Invalid email or password. Please verify your credentials.");
    }
  };

  const handleRoleSelect = (role: "student" | "admin") => {
    setSelectedRole(role);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-12">
      <SEO
        title="Sign In | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="Sign in to your KR Global Learning student or admin portal to access One-on-One live classes, mentor bookings, AI interview bots, and vendor certifications."
      />

      {/* Dynamic Animated Mesh & Neon Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-purple-600/20 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Cyber Grid Background Accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Main 2-Column Responsive Container */}
      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Hero Branding & Visual Showcase (45% / 5 Cols on Desktop) */}
        <div className="lg:col-span-5 space-y-8 text-left hidden lg:block">
          {/* Logo & Category Badge */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-3 no-underline group" title="KR GLOBAL LEARNING PRIVATE LIMITED">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-900/40 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                  <span className="font-extrabold text-xl bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
                    KR
                  </span>
                </div>
              </div>
              <div>
                <span className="font-sans font-black text-2xl tracking-tight text-white block">
                  KR Global Learning
                </span>
                <span className="text-[11px] font-sans text-purple-300 block tracking-normal font-semibold">
                  One-to-One Live Tech Mentorship & Vendor Certification Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Main Tagline */}
          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Learn. Build.{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Grow. Globally.
              </span>
            </h1>
            <p className="text-slate-400 text-sm xl:text-base leading-relaxed">
              Step into India's premier engineering accelerator. Master full stack systems, vendor certifications, and practical hands-on technology skills.
            </p>
          </div>

          {/* Interactive AI Code / Career Visual Card */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">cohort_telemetry.ts</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE COHORT
              </span>
            </div>

            <div className="pt-3 space-y-2 font-mono text-xs text-slate-300 leading-relaxed">
              <p>
                <span className="text-purple-400">const</span>{" "}
                <span className="text-cyan-300">studentMastery</span> ={" "}
                <span className="text-amber-300">await</span> krGlobalLearning.
                <span className="text-purple-300">certifyLearner</span>(&#123;
              </p>
              <p className="pl-4 text-slate-400">
                domain: <span className="text-emerald-300">"Cloud & AI Systems"</span>,
              </p>
              <p className="pl-4 text-slate-400">
                practicalLabs: <span className="text-cyan-300">"10+ Production Deployments"</span>,
              </p>
              <p className="pl-4 text-slate-400">
                systemDesign: <span className="text-cyan-300">"Microservices & Kafka"</span>,
              </p>
              <p>&#125;);</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold">✓ Certification Preparation</span>
              <span className="text-purple-300">Live Mentorship</span>
            </div>
          </div>

          {/* 4 Key Platform Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
              <span className="text-2xl font-extrabold text-white block">84</span>
              <span className="text-xs text-slate-400">Technology & Certification Courses</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
              <span className="text-2xl font-extrabold text-cyan-400 block">1-on-1</span>
              <span className="text-xs text-slate-400">One-on-One Mentorship</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
              <span className="text-2xl font-extrabold text-purple-400 block">100%</span>
              <span className="text-xs text-slate-400">Practical Projects & Labs</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
              <span className="text-2xl font-extrabold text-amber-400 block">Global</span>
              <span className="text-xs text-slate-400">Certification Preparation</span>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Glassmorphism Login Card (55% / 7 Cols on Desktop) */}
        <div className="lg:col-span-7 w-full max-w-xl mx-auto">
          <div className="relative rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-[24px] p-6 sm:p-10 shadow-2xl shadow-purple-950/60 transition-all hover:border-purple-500/30">
            {/* Specular Card Highlight Glow */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

            {/* Mobile Header Logo */}
            <div className="lg:hidden text-center mb-6">
              <Link to="/" className="inline-flex items-center gap-2 no-underline" title="KR GLOBAL LEARNING PRIVATE LIMITED">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
                  <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                    <span className="font-extrabold text-base bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
                      KR
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="font-sans font-bold text-lg text-white block">KR Global Learning</span>
                  <span className="text-[10px] text-purple-300 block font-medium">One-to-One Live Tech Mentorship</span>
                </div>
              </Link>
            </div>

            {/* Title & Subtitle */}
            <div className="text-left mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Sign In to Platform
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Access your personalized masterclasses, AI mentor, and career tools.
              </p>
            </div>

            {/* Segmented Glass Cards Role Switcher (Student vs Admin) */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 rounded-2xl bg-slate-950/80 border border-white/5">
              <button
                type="button"
                onClick={() => handleRoleSelect("student")}
                className={`p-3 rounded-xl text-left transition-all duration-200 cursor-pointer flex items-center gap-3 border ${
                  selectedRole === "student"
                    ? "bg-purple-600/30 border-purple-500/60 text-white shadow-lg shadow-purple-950/50"
                    : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <span className="text-2xl">🎓</span>
                <div className="min-w-0">
                  <span className="block text-xs font-bold truncate text-white">Student Portal</span>
                  <span className="block text-[10px] text-purple-300 truncate">Learner Sign In</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("admin")}
                className={`p-3 rounded-xl text-left transition-all duration-200 cursor-pointer flex items-center gap-3 border ${
                  selectedRole === "admin"
                    ? "bg-indigo-600/30 border-indigo-400/60 text-white shadow-lg shadow-indigo-950/50"
                    : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <span className="text-2xl">👑</span>
                <div className="min-w-0">
                  <span className="block text-xs font-bold truncate text-white">Admin Suite</span>
                  <span className="block text-[10px] text-indigo-300 truncate">Administrator Sign In</span>
                </div>
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@krtech.edu"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all font-sans"
                  />
                  <div className="absolute left-3 top-3.5 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all font-sans"
                  />
                  <div className="absolute left-3 top-3.5 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 cursor-pointer p-0.5"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-white/20 bg-slate-900 cursor-pointer accent-purple-600"
                  />
                  <span>Keep me signed in on this device</span>
                </label>
              </div>

              {/* Gradient Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl shadow-purple-900/30 hover:shadow-purple-900/50 transition-all cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {selectedRole === "admin" ? "Admin Suite" : "Dashboard"}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Google OAuth Section */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-slate-900/90 px-3 text-slate-400 font-semibold tracking-wider">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/api/auth/google";
              }}
              className="w-full py-3 px-4 rounded-xl border border-white/10 bg-slate-950/60 hover:bg-slate-800/60 text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer hover:border-purple-500/40"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Bottom Footer Navigation */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <Link
                to="/"
                className="text-cyan-400 hover:text-cyan-300 no-underline font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>←</span>
                <span>Return to Home</span>
              </Link>
              <span>
                New to KR Global Learning?{" "}
                <Link to="/signup" className="text-white font-bold hover:text-purple-300 transition-colors">
                  Create Account
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
