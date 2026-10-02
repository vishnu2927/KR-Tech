import React, { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import SEO from "../components/common/SEO";
import { lmsService } from "../services/lmsService";

export default function CodeLabPage() {
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>(
    `// JavaScript Algorithm Lab: Two Sum with Hash Map\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log("Indices:", twoSum([2, 7, 11, 15], 9));`
  );
  const [stdin, setStdin] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [executionStats, setExecutionStats] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [running, setRunning] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const codeStarters: Record<string, string> = {
    javascript: `// JavaScript Algorithm Lab: Two Sum with Hash Map\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log("Indices:", twoSum([2, 7, 11, 15], 9));`,
    nodejs: `// Node.js Event Loop & Microtask Queue Demonstration\nconst fs = require('fs');\n\nconsole.log("1. Synchronous log");\nprocess.nextTick(() => console.log("2. nextTick queue"));\nPromise.resolve().then(() => console.log("3. Microtask Promise"));\nsetImmediate(() => console.log("4. Check phase setImmediate"));`,
    python: `# Python 3.12: High-Performance LRU Cache\nfrom functools import lru_cache\nimport time\n\n@lru_cache(maxsize=128)\ndef compute_fib(n):\n    if n <= 1:\n        return n\n    return compute_fib(n - 1) + compute_fib(n - 2)\n\nprint("Fibonacci(35):", compute_fib(35))\nprint("Cache Info:", compute_fib.cache_info())`,
    java: `// Java 21: High-Throughput Microservice with Virtual Threads\nimport java.util.concurrent.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n            IntStream.range(0, 5).forEach(i -> {\n                executor.submit(() -> {\n                    System.out.println("Running on Virtual Thread #" + i);\n                });\n            });\n        }\n    }\n}`,
    cpp: `// C++23: Modern Competitive Programming Setup\n#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> nums = {5, 2, 8, 1, 9};\n    std::sort(nums.begin(), nums.end());\n    std::cout << "Sorted: ";\n    for (int n : nums) std::cout << n << " ";\n    std::cout << std::endl;\n    return 0;\n}`,
    html_css: `<!-- HTML/CSS Glassmorphism Container Preview -->\n<div style="background: rgba(139, 92, 246, 0.15); backdrop-filter: blur(12px); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 16px; padding: 24px; color: white;">\n  <h2>KR Tech Glassmorphism UI</h2>\n  <p>Learn. Build. Grow. Globally.</p>\n</div>`,
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (codeStarters[lang]) {
      setCode(codeStarters[lang]);
    }
  };

  const handleRunCode = async () => {
    setRunning(true);
    try {
      const res = await lmsService.runCode({ language, code, stdin });
      setOutput(res.output);
      setExecutionStats({ time: res.executionTimeMs, memory: res.memoryUsageMb });
      showToast("✓ Execution complete!");
    } catch {
      setOutput("Execution error encountered.");
    } finally {
      setRunning(false);
    }
  };

  const handleAiAssist = async (mode: "explain-error" | "optimize") => {
    setAnalyzing(true);
    try {
      const res = await lmsService.aiCodeAssist({
        mode,
        code,
        errorText: output.includes("Error") ? output : undefined,
        language,
      });
      setAiAnalysis(res);
      showToast(mode === "optimize" ? "✓ AI Optimization generated!" : "✓ AI Error diagnosed!");
    } catch {
      showToast("Failed to analyze code.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO
        title="AI Code Compiler & Lab | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="Browser-based high-speed code compiler for Java, Python, C++, JavaScript, and Node.js with AI Error Explainer and Big-O Complexity Optimizer."
      />
      <DashboardNavbar />

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-2xl animate-bounce">
          {toast}
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-cyan-950/70 border border-purple-500/30 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <span>⚡ Sprint 9.12</span>
              <span>•</span>
              <span>AI Code Compiler & Sandbox</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Full-Stack Cloud Code Lab</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Write, compile, and execute Java 21, Python 3.12, C++23, Node.js, and JavaScript. AI diagnoses runtime errors and refactors code for optimal Big-O complexity.
            </p>
          </div>

          {/* Language Selector Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: "javascript", label: "JavaScript" },
              { key: "python", label: "Python" },
              { key: "java", label: "Java" },
              { key: "cpp", label: "C++" },
              { key: "nodejs", label: "Node.js" },
              { key: "html_css", label: "HTML/CSS" },
            ].map((l) => (
              <button
                key={l.key}
                onClick={() => handleLanguageChange(l.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  language === l.key
                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                    : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editor & Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Column */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden flex flex-col">
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-purple-300 font-bold flex items-center gap-2">
                <span>💻</span> main.{language === "python" ? "py" : language === "java" ? "java" : language === "cpp" ? "cpp" : "js"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAiAssist("optimize")}
                  disabled={analyzing}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-cyan-300 border border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>✨</span> <span>AI Optimize</span>
                </button>
                <button
                  onClick={() => handleAiAssist("explain-error")}
                  disabled={analyzing}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-amber-300 border border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>🔍</span> <span>AI Explain Error</span>
                </button>
              </div>
            </div>

            <textarea
              rows={16}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full flex-1 p-4 bg-slate-950 font-mono text-xs sm:text-sm text-cyan-300 focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />

            <div className="p-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">Length: {code.length} chars</span>
              <button
                onClick={handleRunCode}
                disabled={running}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center gap-2"
              >
                <span>{running ? "Running..." : "▶ Execute Code"}</span>
              </button>
            </div>
          </div>

          {/* Console / Output Column */}
          <div className="space-y-6 flex flex-col">
            {/* Input (stdin) Box */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Custom Standard Input (stdin)</label>
              <input
                type="text"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Optional input parameters or numbers..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Output (stdout) Box */}
            <div className="flex-1 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <span>🖥️</span> Program Output (stdout / stderr)
                </span>
                {executionStats && (
                  <span className="font-mono text-[11px] text-cyan-400">
                    ⏱️ {executionStats.time}ms • 💾 {executionStats.memory}MB
                  </span>
                )}
              </div>

              <div className="flex-1 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-y-auto whitespace-pre-wrap min-h-[140px]">
                {output || "Run code to see terminal execution output here..."}
              </div>
            </div>

            {/* AI Optimization & Error Explanation Output */}
            {aiAnalysis && (
              <div className="p-5 rounded-3xl bg-purple-950/30 border border-purple-500/40 space-y-2 animate-fadeIn text-xs leading-relaxed text-slate-200">
                <div className="font-bold text-purple-300 flex items-center gap-2">
                  <span>🤖 KR AI Code Mentor Audit</span>
                </div>
                <div className="whitespace-pre-wrap">{aiAnalysis}</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
