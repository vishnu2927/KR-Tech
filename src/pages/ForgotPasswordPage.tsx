import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import SEO from "../components/common/SEO";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Step: 1 = Email, 2 = Verify OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Feedback State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Timers
  const [countdown, setCountdown] = useState<number>(600); // 10 minutes (600s)
  const [resendCooldown, setResendCooldown] = useState<number>(60); // 60s cooldown

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: any = null;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  useEffect(() => {
    let timer: any = null;
    if (step === 2 && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // STEP 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await authService.forgotPassword(email.trim());
      setSuccessMsg(res.message || "A 6-digit security code has been sent to your email.");
      setCountdown(600);
      setResendCooldown(60);
      setStep(2);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not dispatch recovery code. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Handle OTP Digits
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);

    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const updated = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i];
    }
    setOtpDigits(updated);
    const nextIdx = Math.min(pasted.length, 5);
    otpInputsRef.current[nextIdx]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setErrorMsg("Please enter all 6 digits of the OTP code.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await authService.verifyOtp(email.trim(), fullOtp);
      setResetToken(res.resetToken || "valid_token");
      setSuccessMsg("Security code verified! You may now set a new password.");
      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      await authService.forgotPassword(email.trim());
      setSuccessMsg("A new 6-digit OTP code has been dispatched.");
      setCountdown(600);
      setResendCooldown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputsRef.current[0]?.focus();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      await authService.resetPassword({
        email: email.trim(),
        resetToken,
        newPassword,
      });
      setStep(4);
    } catch (err: any) {
      setErrorMsg(err.message || "Password update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-12">
      <SEO
        title="Reset Account Password | KR Global Learning"
        description="Recover your KR Global Learning student or admin account with secure 6-digit two-factor OTP verification."
      />

      {/* Ambient Animated Mesh Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-purple-600/20 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyber Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Hero Branding (45% / 5 cols) */}
        <div className="lg:col-span-5 space-y-6 text-left hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-3 no-underline group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-900/40">
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
              <span className="text-[11px] font-mono text-purple-400 block tracking-wider uppercase font-semibold">
                Account Security Center
              </span>
            </div>
          </Link>

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Secure Account{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Recovery.
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              We employ automated cryptographic 6-digit OTP verification with 10-minute validity to protect your student portal, certifications, and payment records.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">🛡️</span>
              <span className="text-xs text-slate-300 font-semibold">Zero-Knowledge Token Rotation</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">⏳</span>
              <span className="text-xs text-slate-300 font-semibold">10-Minute Expiring One-Time Passcodes</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🔒</span>
              <span className="text-xs text-slate-300 font-semibold">Bcrypt Hashing with 12 Salt Rounds</span>
            </div>
          </div>
        </div>

        {/* Right Glass Card (55% / 7 cols) */}
        <div className="lg:col-span-7 w-full max-w-lg mx-auto">
          <div className="relative rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-[24px] p-6 sm:p-10 shadow-2xl shadow-purple-950/60">
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

            {/* Error / Success Banners */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
                <span>✓</span>
                <span>{successMsg}</span>
              </div>
            )}

            {/* STEP 1: Enter Email */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Reset Your Password</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter the email address associated with your account to receive a security code.
                  </p>
                </div>

                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Dispatching Security Code..." : "Send Verification Code →"}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <Link to="/login" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
                    ← Return to Sign In
                  </Link>
                </div>
              </div>
            )}

            {/* STEP 2: Verify 6-Digit OTP */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Enter 6-Digit Code</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Dispatched to <strong className="text-white">{email}</strong>. Valid for{" "}
                    <span className="text-purple-400 font-mono font-bold">{formatTime(countdown)}</span>.
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* 6 Individual Digit Boxes */}
                  <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputsRef.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-slate-950 border border-white/15 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-xl text-white outline-none font-mono"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpDigits.join("").length !== 6}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify Code & Continue →"}
                  </button>
                </form>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="hover:text-white transition-colors"
                  >
                    Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || loading}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold disabled:opacity-40"
                  >
                    {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : "Resend Code"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Set New Password */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Set New Password</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Choose a strong, unique password for your KR Global Learning account.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      New Password (min 6 characters)
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Confirm New Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 shadow-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Updating Credentials..." : "Confirm & Save Password →"}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 4: Email Verification / Reset Success Screen */}
            {step === 4 && (
              <div className="text-center py-6 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/30 animate-bounce">
                  ✓
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold text-white">
                    Password Successfully Reset!
                  </h2>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Your security credentials have been updated in the KR Global Learning database. All active sessions have been rotated for your protection.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-xl transition-all cursor-pointer"
                  >
                    Proceed to Sign In →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
