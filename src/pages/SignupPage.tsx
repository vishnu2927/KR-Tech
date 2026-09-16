import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { I } from "../components/Icons";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [course, setCourse] = useState("Java Backend Development with Spring Boot");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError("Please fill out all required fields.");
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
      setError("You must agree to the Terms & Privacy Policy.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signup({ name: name.trim(), email: email.trim(), phone: phone.trim(), course, password });
      setLoading(false);
      navigate("/dashboard");
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-16 flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white relative overflow-hidden px-4">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-purple-950/50">
          {/* Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-2 text-white no-underline">
              <I.Logo />
              <span className="font-sans font-extrabold text-xl tracking-tight">KR Tech</span>
            </Link>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-white">
              Create Student Account
            </h1>
            <p className="text-xs text-purple-200 mt-1">
              Join 15,000+ engineers mastering tech with 1:1 live mentors
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-purple-200 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aditya Sharma"
                className="w-full px-4 py-2.5 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 text-sm outline-none focus:border-purple-400 font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-purple-200 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-4 py-2.5 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 text-sm outline-none focus:border-purple-400 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-purple-200 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 text-sm outline-none focus:border-purple-400 font-sans"
                />
              </div>
            </div>

            {/* Course Interested In */}
            <div>
              <label className="text-xs font-bold text-purple-200 block mb-1">
                Interested Course / Track *
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 rounded-xl border border-white/20 text-white text-sm outline-none focus:border-purple-400 font-sans cursor-pointer"
              >
                <option value="Java Backend Development with Spring Boot">Java Backend Development (Spring Boot & Microservices)</option>
                <option value="MERN Stack Bootcamp (React 19, Next.js)">MERN Stack Full Stack Mastery (React 19, Node.js)</option>
                <option value="AWS Certified Solutions Architect">AWS Certified Solutions Architect & DevOps</option>
                <option value="Microsoft Azure Administrator (AZ-104)">Microsoft Azure Administrator & Hybrid Cloud</option>
                <option value="Cyber Security & Certified Ethical Hacker">Cyber Security & Certified Ethical Hacker (CEH)</option>
                <option value="Power BI & Data Analytics Mastery">Power BI & Business Analytics Mastery</option>
                <option value="SAP S/4HANA FICO Consultant">SAP S/4HANA FICO Consultant Track</option>
                <option value="Salesforce Administrator & Developer">Salesforce Administrator & Platform Developer</option>
                <option value="Cisco CCNA & Enterprise Networking">Cisco CCNA & Enterprise Networking</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-purple-200 block mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 text-sm outline-none focus:border-purple-400 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-purple-200 block mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 text-sm outline-none focus:border-purple-400 font-sans"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 text-xs text-purple-200 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-white/30 bg-white/10 mt-0.5 cursor-pointer"
                />
                <span>
                  I agree to KR Tech's{" "}
                  <span className="text-cyan-300 font-medium">Terms of Service</span> &{" "}
                  <span className="text-cyan-300 font-medium">Privacy Policy</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-900/40 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? "Creating Account…" : "Create Free Account & Go to Dashboard"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-purple-200">
            <Link to="/" className="text-cyan-300 hover:text-cyan-200 no-underline font-medium">
              ← Back to Home
            </Link>
            <span>
              Already have an account?{" "}
              <Link to="/login" className="text-white font-bold hover:underline">
                Log In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
