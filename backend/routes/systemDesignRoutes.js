const express = require('express');
const router = express.Router();
const SystemDesignSession = require('../models/SystemDesignSession');
const { optionalAuth } = require('../middleware/authMiddleware');

const CURATED_SYSTEM_DESIGN_PROBLEMS = [
  {
    id: 'tinyurl',
    title: 'Design a High-Throughput URL Shortener (TinyURL)',
    difficulty: 'Medium',
    targetDAU: '100M Daily Active Users',
    writesPerSec: '1,150 writes/sec',
    readsPerSec: '11,500 reads/sec (10:1 ratio)',
    storageEstimate: '15 TB storage across 5 years',
    coreComponents: [
      'Application Load Balancer (Round Robin / Least Connections)',
      'Stateless API Gateways (Node.js / Go)',
      'Base62 Encoding Service with Pre-generated Key Range Service (Zookeeper)',
      'Redis Cluster for Sub-10ms Read Latency (LRU eviction)',
      'NoSQL Database (MongoDB / Cassandra) partitioned by ShortURL Hash',
    ],
    bottlenecks: ['Single Point of Failure in Key Generation Service', 'Cache Stampede on Viral Links'],
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
    bottlenecks: ['Driver ping thundering herd during peak rush hours', 'Cross-cell driver location queries'],
  },
];

router.get('/problems', (req, res) => {
  res.json({ success: true, problems: CURATED_SYSTEM_DESIGN_PROBLEMS });
});

router.post('/save', optionalAuth, async (req, res) => {
  try {
    const studentEmail = (req.user && req.user.email) || req.body.studentEmail || 'student@krtech.in';
    const { problemTitle, problemId, architectureComponents, tradeoffAnalysis } = req.body;

    const session = await SystemDesignSession.create({
      studentEmail,
      problemTitle,
      problemId,
      architectureComponents,
      tradeoffAnalysis,
    });

    res.status(201).json({ success: true, message: 'System design session saved', session });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save design session', error: err.message });
  }
});

module.exports = router;
