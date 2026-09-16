import React, { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
          <div className="max-w-md w-full text-center p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center text-3xl border border-red-500/20">
              ⚠️
            </div>
            <h2 className="text-2xl font-bold font-sans mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-400 mb-6">
              An unexpected application error occurred. We have logged this issue for investigation.
            </p>
            {this.state.error && (
              <pre className="text-[11px] p-3 rounded-xl bg-slate-950 text-red-300 font-mono text-left overflow-x-auto mb-6 max-h-32 border border-slate-800">
                {this.state.error.toString()}
              </pre>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                Reload Page
              </button>
              <Link
                to="/"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-bold border border-slate-700 transition-all no-underline"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
