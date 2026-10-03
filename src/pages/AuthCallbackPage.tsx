import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuthTokens } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const refreshToken = searchParams.get("refreshToken");
      const error = searchParams.get("error");

      if (error) {
        let msg = "Authentication failed. Please try again.";
        if (error === "google_not_configured") {
          msg = "Google OAuth is not configured on this server.";
        } else if (error === "email_not_verified") {
          msg = "Your Google account email is not verified.";
        } else if (error === "oauth_state_mismatch") {
          msg = "OAuth state validation failed. Please try again.";
        } else if (error === "oauth_exchange_failed") {
          msg = "Failed to exchange authorization code with Google.";
        }
        setErrorMessage(msg);
        return;
      }

      if (token) {
        try {
          const user = await loginWithOAuthTokens(token, refreshToken || undefined);
          // Redirect safely based on role, replacing browser history
          if (user.role === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        } catch (err: any) {
          setErrorMessage(err.message || "Failed to initialize user session");
        }
      } else {
        setErrorMessage("Invalid authentication response received.");
      }
    };

    handleCallback();
  }, [searchParams, loginWithOAuthTokens, navigate]);

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Authentication Notice</h2>
          <p className="text-slate-300 text-sm mb-6">{errorMessage}</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-300 text-sm font-medium">Completing secure authentication...</p>
      </div>
    </div>
  );
}
