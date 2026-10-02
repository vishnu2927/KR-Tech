import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/common/SEO";

export default function SignupPage() {
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
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError("Please complete all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
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

  const handleSocialSignup = (provider: string) => {
    setError("");
    setSocialLoading(provider);
    setTimeout(async () => {
      try {
        await signup({
          name: "Aditya Sharma",
          email: "student@krtech.edu",
          phone: "+91 98765 43210",
          course,
          password: "password123",
        });
        setSocialLoading(null);
        navigate("/dashboard");
      } catch {
        setSocialLoading(null);
        setError(`${provider} signup notice: Please fill out the form directly to customize your cohort.`);
      }
    }, 650);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-12">
      <SEO
        title="Create Student Account | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="Join 15,000+ engineers mastering full stack web development, cloud certifications, and AI agent architectures with One-on-One live mentors."
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
              Join live interactive cohorts with One-on-One mentorship from Staff Engineers at Google, Amazon, and Microsoft.
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
              <span className="text-2xl font-extrabold text-white block">15,000+</span>
              <span className="text-xs text-slate-400">Certified Learners</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
              <span className="text-2xl font-extrabold text-emerald-400 block">100+</span>
              <span className="text-xs text-slate-400">Industry Certifications</span>
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
                    placeholder="Min. 6 chars"
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
                    placeholder="Re-enter"
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

            {/* Social Divider */}
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-3 bg-slate-900 text-[11px] font-mono font-bold text-slate-400 uppercase">
                Or Register With
              </span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                disabled={Boolean(socialLoading) || loading}
                onClick={() => handleSocialSignup("Google")}
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

              <button
                type="button"
                disabled={Boolean(socialLoading) || loading}
                onClick={() => handleSocialSignup("GitHub")}
                className="py-2.5 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-white/10 transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0 fill-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </button>

              <button
                type="button"
                disabled={Boolean(socialLoading) || loading}
                onClick={() => handleSocialSignup("LinkedIn")}
                className="py-2.5 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-white/10 transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z" />
                </svg>
                <span className="hidden sm:inline">LinkedIn</span>
              </button>
            </div>

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
