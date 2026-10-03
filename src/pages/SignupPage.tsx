import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/common/SEO";

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [course, setCourse] = useState("Full Stack MERN & Next.js 15 Masterclass");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError === "google_not_configured") {
      setError("Google OAuth is not configured on this server. Please fill out the registration form below.");
    } else if (oauthError === "email_not_verified") {
      setError("Your Google account email is not verified. Please verify your email first.");
    } else if (oauthError) {
      setError("Google registration failed. Please register with your email and password.");
    }
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError("Please complete all required fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }
    if (!agreeTerms) {
      setError("Please accept the Terms of Service & Privacy Policy to proceed.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        course,
        password,
      });
      setLoading(false);
      navigate("/dashboard");
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-12">
      <SEO
        title="Create Student Account | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="Master full stack web development, vendor certification preparation, and cloud architectures with One-on-One live mentorship."
      />

      {/* Dynamic Animated Mesh & Neon Glow Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[550px] h-[550px] bg-purple-600/20 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

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
        {/* Left Column: Hero Branding & Educational Showcase (45% / 5 Cols on Desktop) */}
        <div className="lg:col-span-5 space-y-8 text-left hidden lg:block">
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

          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Accelerate Your{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Career. Globally.
              </span>
            </h1>
            <p className="text-slate-400 text-sm xl:text-base leading-relaxed">
              Join live interactive cohorts with One-on-One mentorship from Experienced Technical Practitioners & Mentors.
            </p>
          </div>

          {/* Value Props Card */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-sm">
                ⚡
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">Full Stack & DSA Mastery</h4>
                <p className="text-[11px] text-slate-400">250+ LeetCode problems & 4 production-grade capstones</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-sm">
                🎙️
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">AI Mock Interview Simulator</h4>
                <p className="text-[11px] text-slate-400">Real-time speech scoring & filler word diagnostics</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-sm">
                🚀
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">Hands-On Practical Labs</h4>
                <p className="text-[11px] text-slate-400">Enterprise microservices, Cloud architectures & AI agent deployments</p>
              </div>
            </div>
          </div>

          {/* Platform Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
              <span className="text-2xl font-extrabold text-white block">84</span>
              <span className="text-xs text-slate-400">Technology & Certification Courses</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
              <span className="text-2xl font-extrabold text-emerald-400 block">1-on-1</span>
              <span className="text-xs text-slate-400">One-on-One Mentorship</span>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Glassmorphism Register Card (55% / 7 Cols on Desktop) */}
        <div className="lg:col-span-7 w-full max-w-xl mx-auto">
          <div className="relative rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-[24px] p-6 sm:p-10 shadow-2xl shadow-purple-950/60 transition-all hover:border-purple-500/30">
            {/* Specular Card Highlight Glow */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

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

            {/* Title */}
            <div className="text-left mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create Student Account
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Start your engineering transformation with One-on-One live mentors.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aditya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-sans"
                  />
                  <div className="absolute left-3 top-3 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <div className="absolute left-3 top-3 text-slate-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    WhatsApp Phone *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <div className="absolute left-3 top-3 text-slate-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Course Track */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Target Career Track
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Full Stack MERN & Next.js 15 Masterclass">Full Stack MERN & Next.js 15 (with WebSockets)</option>
                  <option value="Java Backend Development with Spring Boot">Java Backend & Microservices (Spring Boot 3 + Kafka)</option>
                  <option value="Python Data Science & Machine Learning">Python Data Science, AI Agents & LLMs</option>
                  <option value="Data Structures & Algorithms (250 Grind)">DSA 250 (Problem Solving & System Grind)</option>
                  <option value="Cloud Computing & DevOps Masterclass">Cloud Computing & DevOps Certification Track</option>
                </select>
              </div>

              {/* Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Password *</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">Confirm *</label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-white/20 bg-slate-900 cursor-pointer accent-purple-600 mt-0.5"
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-300 cursor-pointer select-none leading-relaxed">
                  I agree to KR Global Learning's <Link to="/legal" className="text-cyan-400 hover:underline">Terms of Service</Link> & <Link to="/legal" className="text-cyan-400 hover:underline">Student Learning Charter</Link>.
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
                    <span>Creating Student Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Enrollment & Enter Dashboard</span>
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
                  Or register with
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
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <Link
                to="/"
                className="text-cyan-400 hover:text-cyan-300 no-underline font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>←</span>
                <span>Home</span>
              </Link>
              <span>
                Already enrolled?{" "}
                <Link to="/login" className="text-white font-bold hover:text-purple-300 transition-colors">
                  Sign In
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
