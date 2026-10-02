import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/common/SEO";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<"student" | "admin">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

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
    if (role === "admin") {
      setEmail("admin@krtech.com");
      setPassword("admin123");
    } else {
      setEmail("student@krtech.edu");
      setPassword("password123");
    }
    setError("");
  };

  const handleSocialLogin = (provider: string) => {
    setError("");
    setSocialLoading(provider);
    setTimeout(async () => {
      try {
        const loggedUser = await login("student@krtech.edu", "password123", rememberMe);
        setSocialLoading(null);
        navigate("/dashboard");
      } catch {
        setSocialLoading(null);
        setError(`${provider} Authentication: Please use standard credentials or register a new student account.`);
      }
    }, 650);
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
              <span className="text-emerald-400 font-semibold">✓ Global Industry Certification</span>
              <span className="text-purple-300">Q1 2026 Cohort</span>
            </div>
          </div>

          {/* 4 Key Platform Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
              <span className="text-2xl font-extrabold text-white block">15,000+</span>
              <span className="text-xs text-slate-400">Active Students</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
              <span className="text-2xl font-extrabold text-cyan-400 block">98.4%</span>
              <span className="text-xs text-slate-400">Practical Mastery Rate</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
              <span className="text-2xl font-extrabold text-purple-400 block">50+</span>
              <span className="text-xs text-slate-400">Masterclasses</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
              <span className="text-2xl font-extrabold text-amber-400 block">30+</span>
              <span className="text-xs text-slate-400">MAANG Mentors</span>
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
                  <span className="block text-[10px] text-purple-300 truncate">Demo Credentials</span>
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
                  <span className="block text-[10px] text-indigo-300 truncate">Superuser Access</span>
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

            {/* Social Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-3 bg-slate-900 text-[11px] font-mono font-bold text-slate-400 uppercase">
                Or Continue With
              </span>
            </div>

            {/* Social Logins: Google, GitHub, LinkedIn */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Google */}
              <button
                type="button"
                disabled={Boolean(socialLoading) || loading}
                onClick={() => handleSocialLogin("Google")}
                className="py-2.5 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-white/10 transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
                </svg>
                <span className="hidden sm:inline">Google</span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                disabled={Boolean(socialLoading) || loading}
                onClick={() => handleSocialLogin("GitHub")}
                className="py-2.5 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-white/10 transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0 fill-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                disabled={Boolean(socialLoading) || loading}
                onClick={() => handleSocialLogin("LinkedIn")}
                className="py-2.5 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-white/10 transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z" />
                </svg>
                <span className="hidden sm:inline">LinkedIn</span>
              </button>
            </div>

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
