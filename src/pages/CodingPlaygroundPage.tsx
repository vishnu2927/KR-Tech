import React, { useState } from 'react';
import SEO from '../components/common/SEO';
import { codingPlatformService } from '../services/codingPlatformService';

const STARTER_CODES: Record<string, string> = {
  javascript: `// KR Global Learning JavaScript Sandbox Engine
function solve(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

const result = solve([2, 7, 11, 15], 9);
console.log("Indices found:", result);
`,
  python: `# KR Global Learning Python Sandbox
def two_sum(nums, target):
    prev_map = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in prev_map:
            return [prev_map[diff], i]
        prev_map[n] = i
    return []

print("Indices found:", two_sum([2, 7, 11, 15], 9))
`,
  cpp: `// KR Global Learning C++ 20 Sandbox
#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int diff = target - nums[i];
        if (map.count(diff)) {
            cout << "Indices found: [" << map[diff] << ", " << i << "]" << endl;
            return 0;
        }
        map[nums[i]] = i;
    }
    return 0;
}
`,
  java: `// KR Global Learning Java Sandbox
import java.util.*;

public class Main {
    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) {
                System.out.println("Indices found: [" + map.get(diff) + ", " + i + "]");
                return;
            }
            map.put(nums[i], i);
        }
    }
}
`,
};

export default function CodingPlaygroundPage() {
  const [language, setLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>(STARTER_CODES.javascript);
  const [stdin, setStdin] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [output, setOutput] = useState<{
    stdout: string;
    stderr: string | null;
    runtimeMs: number;
    memoryKb: number;
    status: string;
  } | null>(null);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(STARTER_CODES[newLang] || '');
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await codingPlatformService.runCode({
        code,
        language,
        stdin,
      });
      setOutput(res);
    } catch (err: any) {
      setOutput({
        stdout: '',
        stderr: err?.response?.data?.message || err.message || 'Execution error',
        runtimeMs: 0,
        memoryKb: 0,
        status: 'Error',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="min-h-screen bg-[#070913] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Online Code Compiler & Multi-Language Sandbox | KR Global Learning"
        description="Compile and execute JavaScript, Python, C++, and Java code with sub-30ms response times, stdin/stdout redirection, and memory tracking."
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h1 className="text-base font-bold text-white">Online Code Sandbox</h1>
              <p className="text-xs text-slate-400">Isolated Cloud Compiler & Runner</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-purple-500"
            >
              <option value="javascript">JavaScript (Node.js 22)</option>
              <option value="python">Python 3.12</option>
              <option value="cpp">C++ 20 (GCC)</option>
              <option value="java">Java 21 (OpenJDK)</option>
            </select>

            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <span>▶</span> Run Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Editor & Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Code Editor Panel (7 cols) */}
          <div className="lg:col-span-7 bg-[#0b0e1b] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[580px]">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>main.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'java'}</span>
              <span>UTF-8 • Tab: 2</span>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Line Numbers */}
              <div className="w-12 py-3 bg-[#080a14] select-none text-right pr-3 text-xs font-mono text-slate-600 space-y-1">
                {Array.from({ length: Math.max(lineCount, 20) }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Textarea Code Input */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 p-3 bg-transparent font-mono text-xs text-purple-200 resize-none focus:outline-none leading-relaxed overflow-y-auto"
              />
            </div>

            {/* Stdin Panel */}
            <div className="p-3 bg-slate-950/80 border-t border-white/5">
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Custom Standard Input (stdin):
              </label>
              <input
                type="text"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Pass custom CLI parameters or input values..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs font-mono text-slate-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Execution Terminal Console (5 cols) */}
          <div className="lg:col-span-5 bg-[#080a14] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[580px]">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Terminal Output
              </span>

              {output && (
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span className="text-emerald-400">{output.runtimeMs}ms</span>
                  <span>{(output.memoryKb / 1024).toFixed(1)} MB</span>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2">
              {!output ? (
                <div className="text-slate-500 italic">
                  Press "▶ Run Code" to execute code and view stdout output in real time.
                </div>
              ) : output.stderr ? (
                <pre className="text-rose-400 whitespace-pre-wrap">{output.stderr}</pre>
              ) : (
                <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed">
                  {output.stdout}
                </pre>
              )}
            </div>

            {output && (
              <div className="p-3 bg-slate-950 border-t border-white/5 flex items-center justify-between text-xs">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    output.status === 'Success'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  Exit Status: {output.status}
                </span>
                <button
                  onClick={() => setOutput(null)}
                  className="text-slate-500 hover:text-white text-[11px]"
                >
                  Clear Console
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
