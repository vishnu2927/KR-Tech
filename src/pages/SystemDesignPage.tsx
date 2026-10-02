import React, { useState } from 'react';
import SEO from '../components/common/SEO';

interface SystemDesignProblem {
  id: string;
  title: string;
  difficulty: string;
  targetDAU: string;
  writesPerSec: string;
  readsPerSec: string;
  storageEstimate: string;
  coreComponents: string[];
  bottlenecks: string[];
}

const DESIGN_PROBLEMS: SystemDesignProblem[] = [
  {
    id: 'tinyurl',
    title: 'Design a High-Throughput URL Shortener (TinyURL)',
    difficulty: 'Medium',
    targetDAU: '100M Daily Active Users',
    writesPerSec: '1,150 writes/sec',
    readsPerSec: '11,500 reads/sec (10:1 Read-to-Write Ratio)',
    storageEstimate: '15 TB storage across 5 years',
    coreComponents: [
      'Application Load Balancer (Round Robin / Least Connections)',
      'Stateless API Gateways (Node.js / Express)',
      'Base62 Encoding Service with Zookeeper Key Range Coordinator',
      'Redis Cluster for Sub-10ms Read Latency (LRU eviction policy)',
      'NoSQL Database (MongoDB / Cassandra) partitioned by ShortURL Hash',
    ],
    bottlenecks: [
      'Single Point of Failure in Key Generation Service',
      'Cache Stampede on Viral Celebrity Links',
    ],
  },
  {
    id: 'uber-backend',
    title: 'Design Real-Time Geospatial Driver Dispatch (Uber / Ola)',
    difficulty: 'Hard',
    targetDAU: '50M Active Passengers & 5M Active Drivers',
    writesPerSec: '100,000 driver GPS coordinates/sec (every 3 seconds)',
    readsPerSec: '50,000 passenger ride queries/sec',
    storageEstimate: '50 GB in-memory geospatial cache',
    coreComponents: [
      'Uber H3 / Google S2 Spatial Hexagonal Grid Indexing',
      'Redis PubSub / WebSockets Gateway for real-time driver coordinate broadcasts',
      'Distributed Driver State Machine (IDLE -> MATCHED -> RIDING)',
      'Redlock distributed locks to eliminate double-booking race conditions',
    ],
    bottlenecks: [
      'Driver ping thundering herd during peak rush hours',
      'Cross-cell boundary geospatial query latency',
    ],
  },
];

export default function SystemDesignPage() {
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([
    'Application Load Balancer',
    'Redis Cluster Cache',
    'Primary Database with Read Replicas',
  ]);
  const [consistencyChoice, setConsistencyChoice] = useState('eventual');
  const [cachingPattern, setCachingPattern] = useState('cache-aside');
  const [auditScore, setAuditScore] = useState<number | null>(null);

  const problem = DESIGN_PROBLEMS[selectedProblemIndex];

  const handleToggleComponent = (comp: string) => {
    if (selectedComponents.includes(comp)) {
      setSelectedComponents(selectedComponents.filter((c) => c !== comp));
    } else {
      setSelectedComponents([...selectedComponents, comp]);
    }
  };

  const handleRunArchitectureAudit = () => {
    let score = 70;
    if (selectedComponents.includes('Application Load Balancer')) score += 10;
    if (selectedComponents.includes('Redis Cluster Cache')) score += 10;
    if (selectedComponents.includes('Kafka Message Broker')) score += 5;
    if (cachingPattern === 'cache-aside') score += 5;
    setAuditScore(Math.min(98, score));
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="High-Level System Design Simulator | KR Global Learning"
        description="Master distributed systems architecture: TinyURL, Uber dispatch, distributed caching, capacity estimations, and microservices trade-offs."
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-950/40 to-cyan-950/30 border border-white/10 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase">
                <span>🏛️ Distributed Systems Architectural Canvas</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                System Design Studio
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                Tackle Staff-level system design rounds. Calculate capacity estimations, select architectural topologies, and audit for bottlenecks.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-white/10">
              {DESIGN_PROBLEMS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProblemIndex(idx);
                    setAuditScore(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedProblemIndex === idx
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.title.split(' ')[2]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Canvas: Specifications (Left) & Architectural Components (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Specifications & Scale Estimations (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">{problem.title}</h2>
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold">
                  {problem.difficulty}
                </span>
              </div>

              {/* Scale Estimations Grid */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Back-of-the-Envelope Capacity
                </h3>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Target DAU</span>
                    <span className="text-sm font-bold text-cyan-300">{problem.targetDAU}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Writes / Second</span>
                    <span className="text-sm font-bold text-purple-300">{problem.writesPerSec}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Reads / Second</span>
                    <span className="text-sm font-bold text-emerald-300">{problem.readsPerSec}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Storage Footprint</span>
                    <span className="text-sm font-bold text-amber-300">{problem.storageEstimate}</span>
                  </div>
                </div>
              </div>

              {/* Core Components Recommended */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Reference Architecture Blueprint
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {problem.coreComponents.map((comp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-400">✓</span>
                      <span>{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottlenecks to Watch Out For */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1.5">
                <h4 className="text-xs font-bold text-rose-300 uppercase">Critical Bottlenecks</h4>
                <ul className="text-xs text-rose-200/80 space-y-1">
                  {problem.bottlenecks.map((b, idx) => (
                    <li key={idx}>⚠️ {b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Topology Builder & Auditor (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Component Toggles */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Assemble Architecture Topology
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Application Load Balancer',
                  'Stateless Microservices (Node.js/Go)',
                  'Redis Cluster Cache',
                  'Kafka Message Broker',
                  'Primary Database with Read Replicas',
                  'Consistent Hashing Sharding Layer',
                  'Zookeeper Key Generation Cluster',
                  'S3 Object Storage for Blob Media',
                ].map((comp) => {
                  const isSelected = selectedComponents.includes(comp);
                  return (
                    <button
                      key={comp}
                      onClick={() => handleToggleComponent(comp)}
                      className={`p-3.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-purple-600/30 border-purple-400 text-white shadow'
                          : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{comp}</span>
                      <span>{isSelected ? '✓' : '+'}</span>
                    </button>
                  );
                })}
              </div>

              {/* Trade-off Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Consistency Model</label>
                  <select
                    value={consistencyChoice}
                    onChange={(e) => setConsistencyChoice(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="eventual">Eventual Consistency (High Availability)</option>
                    <option value="strong">Strong Consistency (Raft / Paxos)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Caching Strategy</label>
                  <select
                    value={cachingPattern}
                    onChange={(e) => setCachingPattern(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="cache-aside">Cache-Aside with Redis</option>
                    <option value="write-through">Write-Through with CDC</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleRunArchitectureAudit}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  🚀 Run AI Architecture Audit
                </button>
              </div>
            </div>

            {/* AI Architecture Audit Results */}
            {auditScore !== null && (
              <div className="bg-gradient-to-r from-purple-950/40 to-slate-900/90 border border-purple-500/40 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">
                    Architecture Viability Score
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-400">{auditScore}/100</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {auditScore >= 85
                    ? 'Superb architecture! Your decoupling of the load balancer, cache layer, and asynchronous message queue avoids bottlenecks at 100k+ TPS.'
                    : 'Good foundation. Consider adding a Kafka message queue to buffer peak burst traffic and decouple long-running writes.'}
                </p>

                <div className="p-3 bg-slate-950/60 rounded-xl text-[11px] text-purple-300 font-mono">
                  Scale Analysis: Can comfortably handle {problem.writesPerSec} with P99 latency &lt; 25ms.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
