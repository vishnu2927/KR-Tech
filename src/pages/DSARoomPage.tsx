import React, { useState } from 'react';
import SEO from '../components/common/SEO';

interface DSAProblem {
  id: string;
  number: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  companies: string[];
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  solutions: Record<string, string>;
  timeComplexity: string;
  spaceComplexity: string;
}

const DAILY_PROBLEMS: DSAProblem[] = [
  {
    id: 'trapping-rain-water',
    number: 42,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    topics: ['Arrays', 'Two Pointers', 'Dynamic Programming', 'Monotonic Stack'],
    companies: ['Google', 'Amazon', 'Microsoft', 'Uber'],
    description:
      'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map traps 6 units of rainwater in total.',
      },
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    timeComplexity: 'O(N) — Single pass with two pointers',
    spaceComplexity: 'O(1) — Auxiliary space',
    solutions: {
      cpp: `int trap(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int leftMax = 0, rightMax = 0, totalWater = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                totalWater += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                totalWater += rightMax - height[right];
            }
            right--;
        }
    }
    return totalWater;
}`,
      python: `def trap(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    left_max, right_max = 0, 0
    water = 0
    
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
            
    return water`,
      javascript: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      height[left] >= leftMax ? (leftMax = height[left]) : (water += leftMax - height[left]);
      left++;
    } else {
      height[right] >= rightMax ? (rightMax = height[right]) : (water += rightMax - height[right]);
      right--;
    }
  }
  return water;
}`,
      java: `public int trap(int[] height) {
    int left = 0, right = height.length - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) leftMax = height[left];
            else water += leftMax - height[left];
            left++;
        } else {
            if (height[right] >= rightMax) rightMax = height[right];
            else water += rightMax - height[right];
            right--;
        }
    }
    return water;
}`,
    },
  },
  {
    id: 'longest-consecutive-sequence',
    number: 128,
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    topics: ['Arrays', 'Hash Table', 'Union Find'],
    companies: ['Google', 'Meta', 'Amazon', 'Atlassian'],
    description:
      'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.',
    examples: [
      {
        input: 'nums = [100,4,200,1,3,2]',
        output: '4',
        explanation: 'The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.',
      },
    ],
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    timeComplexity: 'O(N) — Each number visited at most twice',
    spaceComplexity: 'O(N) — Hash Set storage',
    solutions: {
      cpp: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> numSet(nums.begin(), nums.end());
    int longest = 0;
    
    for (int num : numSet) {
        // Start sequence only if num - 1 is absent
        if (!numSet.count(num - 1)) {
            int current = num;
            int streak = 1;
            while (numSet.count(current + 1)) {
                current++;
                streak++;
            }
            longest = max(longest, streak);
        }
    }
    return longest;
}`,
      python: `def longestConsecutive(nums: list[int]) -> int:
    num_set = set(nums)
    longest = 0
    
    for num in num_set:
        if num - 1 not in num_set:
            current = num
            streak = 1
            while current + 1 in num_set:
                current += 1
                streak += 1
            longest = max(longest, streak)
            
    return longest`,
      javascript: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let longest = 0;

  for (const num of set) {
    if (!set.has(num - 1)) {
      let cur = num;
      let streak = 1;
      while (set.has(cur + 1)) {
        cur++;
        streak++;
      }
      longest = Math.max(longest, streak);
    }
  }
  return longest;
}`,
      java: `public int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int n : nums) set.add(n);
    int longest = 0;
    
    for (int n : set) {
        if (!set.contains(n - 1)) {
            int cur = n;
            int streak = 1;
            while (set.contains(cur + 1)) {
                cur++;
                streak++;
            }
            longest = Math.max(longest, streak);
        }
    }
    return longest;
}`,
    },
  },
];

export default function DSARoomPage() {
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [activeLang, setActiveLang] = useState<'cpp' | 'python' | 'javascript' | 'java'>('cpp');
  const [copied, setCopied] = useState(false);
  const [userApproach, setUserApproach] = useState('');
  const [communityApproaches, setCommunityApproaches] = useState([
    {
      author: 'Aakash R. (TCS Digital Offer)',
      badge: 'Code Samurai',
      text: 'Using Monotonic Decreasing Stack is also very intuitive for Trapping Rain Water! Whenever current bar is taller than stack top, you pop and calculate water bounded by the new stack top.',
      upvotes: 24,
    },
    {
      author: 'Neha Sundaram (SDE at Swiggy)',
      badge: 'Verified Mentor',
      text: 'For LeetCode 42, interviewers always look for whether you can optimize from O(N) space to O(1) space on the whiteboard without getting confused by index boundaries.',
      upvotes: 41,
    },
  ]);

  const currentProblem = DAILY_PROBLEMS[selectedProblemIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentProblem.solutions[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostApproach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userApproach.trim()) return;
    setCommunityApproaches((prev) => [
      {
        author: 'You (Student)',
        badge: 'Peer Contributor',
        text: userApproach.trim(),
        upvotes: 1,
      },
      ...prev,
    ]);
    setUserApproach('');
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="DSA Problem of the Day & Code Arena | KR Global Learning"
        description="Master 250+ curated LeetCode algorithmic problems with optimal space-time complexities in C++, Python, Java, and JavaScript."
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-950/40 to-slate-900/60 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase">
                <span>⚔️ Algorithmic Masterclass</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
                DSA 250 Grind Arena
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                Tackle daily curated problems, dissect optimal time and space complexity models, and discuss clean idiomatic code across C++, Python, Java, and JavaScript.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 p-2 rounded-2xl">
              {DAILY_PROBLEMS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProblemIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedProblemIndex === idx
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Problem #{p.number}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problem Breakdown Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Problem Spec & Description (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">
                    {currentProblem.number}. {currentProblem.title}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    currentProblem.difficulty === 'Hard'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {currentProblem.difficulty}
                </span>
              </div>

              {/* Topics & Companies */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {currentProblem.topics.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/20 text-[11px] text-purple-300 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                  <span className="text-slate-500">Asked by:</span>
                  {currentProblem.companies.map((c) => (
                    <span key={c} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Problem Statement
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentProblem.description}
                </p>
              </div>

              {/* Examples */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Example Case
                </h3>
                {currentProblem.examples.map((ex, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded-xl border border-white/5 space-y-1 font-mono text-xs">
                    <p className="text-slate-400">
                      <span className="text-cyan-400">Input:</span> {ex.input}
                    </p>
                    <p className="text-slate-400">
                      <span className="text-purple-400">Output:</span> {ex.output}
                    </p>
                    {ex.explanation && (
                      <p className="text-[11px] text-slate-500 font-sans mt-1">
                        {ex.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Constraints
                </h3>
                <ul className="list-disc list-inside text-xs font-mono text-slate-400 space-y-1">
                  {currentProblem.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Target Complexity */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-cyan-950/30 border border-purple-500/20 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Target Complexity Threshold
                </h4>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300">Time: {currentProblem.timeComplexity}</span>
                  <span className="text-purple-300">Space: {currentProblem.spaceComplexity}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Code Editor & Peer Discussions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Code Solution Box */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden">
              {/* Language Selector & Copy Button */}
              <div className="px-6 py-3 bg-slate-950 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(['cpp', 'python', 'javascript', 'java'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-all uppercase ${
                        activeLang === lang
                          ? 'bg-purple-600 text-white font-bold shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang === 'cpp' ? 'C++ 20' : lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopyCode}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-white/5 transition-all"
                >
                  <span>{copied ? '✓ Copied' : '📋 Copy Solution'}</span>
                </button>
              </div>

              {/* Code Display */}
              <pre className="p-6 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed bg-[#0a0d1d]">
                <code>{currentProblem.solutions[activeLang]}</code>
              </pre>
            </div>

            {/* Peer Approach Discussions */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 space-y-5">
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span>💬 Peer Optimization Insights</span>
                <span className="text-xs text-purple-400 font-normal">
                  {communityApproaches.length} Perspectives
                </span>
              </h3>

              {/* Approach Input */}
              <form onSubmit={handlePostApproach} className="space-y-3">
                <textarea
                  rows={3}
                  value={userApproach}
                  onChange={(e) => setUserApproach(e.target.value)}
                  placeholder="Share an alternative approach, stack optimization, or edge case trick..."
                  className="w-full p-3 bg-slate-800 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Post Insight
                  </button>
                </div>
              </form>

              {/* Discussions List */}
              <div className="space-y-3">
                {communityApproaches.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-800/60 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{item.author}</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">
                          {item.badge}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        ▲ {item.upvotes}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
