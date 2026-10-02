/**
 * KR Tech Enterprise Email Queue & Retry Abstraction
 * Production-ready asynchronous queue with retry exponential backoff and MongoDB audit persistence.
 */

const EventEmitter = require('events');
const EmailLog = require('../models/EmailLog');

class EmailQueue extends EventEmitter {
  constructor(concurrency = 2, maxRetries = 3) {
    super();
    this.concurrency = concurrency;
    this.maxRetries = maxRetries;
    this.queue = [];
    this.activeWorkers = 0;
    this.stats = {
      completed: 0,
      failed: 0,
      retried: 0,
      totalAdded: 0,
    };
  }

  /**
   * Add a new email dispatch job to the queue
   * @param {string} name - Job identifier
   * @param {Object} jobData - Email dispatch arguments (to, template, data, metadata, attachments, logId)
   * @param {Object} [opts] - Options like maxRetries, delay
   */
  async add(name, jobData, opts = {}) {
    const job = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name,
      data: jobData,
      opts: {
        maxRetries: opts.maxRetries || this.maxRetries,
        backoffDelayMs: opts.backoffDelayMs || 2000,
        ...opts,
      },
      attempts: 0,
      retryCount: 0,
      status: 'waiting',
      createdAt: new Date(),
      lastError: null,
    };

    this.queue.push(job);
    this.stats.totalAdded++;
    this.emit('job:added', job);

    // Trigger queue processing in background
    setImmediate(() => this._processNext());

    return job;
  }

  /**
   * Process next waiting job if concurrency allows
   */
  async _processNext() {
    if (this.activeWorkers >= this.concurrency) return;
    if (this.queue.length === 0) return;

    // Find first waiting job
    const jobIndex = this.queue.findIndex((j) => j.status === 'waiting');
    if (jobIndex === -1) return;

    const job = this.queue[jobIndex];
    job.status = 'active';
    job.attempts++;
    this.activeWorkers++;

    this.emit('job:active', job);

    try {
      // Lazy load to avoid circular reference
      const { sendEmailDirect } = require('./emailService');
      const result = await sendEmailDirect(job.data);

      if (result.success) {
        job.status = 'completed';
        this.stats.completed++;
        this.emit('job:completed', job, result);

        // Update MongoDB EmailLog with final retry state if log exists
        if (result.logId) {
          await EmailLog.findByIdAndUpdate(result.logId, {
            retryCount: job.retryCount,
            attempts: job.attempts,
            lastAttemptAt: new Date(),
          });
        }

        // Clean up completed job from queue memory
        this.queue = this.queue.filter((j) => j.id !== job.id);
      } else {
        throw new Error(result.error || 'Email dispatch failed');
      }
    } catch (err) {
      job.lastError = err.message;
      this.emit('job:error', job, err);

      if (job.attempts < job.opts.maxRetries) {
        job.retryCount++;
        this.stats.retried++;
        job.status = 'waiting';

        // Exponential backoff delay
        const backoff = job.opts.backoffDelayMs * Math.pow(2, job.retryCount - 1);
        console.warn(`[EmailQueue] Retrying job ${job.id} (attempt ${job.attempts}/${job.opts.maxRetries}) in ${backoff}ms`);

        setTimeout(() => {
          this._processNext();
        }, backoff);
      } else {
        job.status = 'failed';
        this.stats.failed++;
        this.emit('job:failed', job, err);

        // Update MongoDB log as failed with retry count
        if (job.data.logId) {
          await EmailLog.findByIdAndUpdate(job.data.logId, {
            status: 'failed',
            error: err.message,
            retryCount: job.retryCount,
            attempts: job.attempts,
            lastAttemptAt: new Date(),
          });
        }
      }
    } finally {
      this.activeWorkers--;
      setImmediate(() => this._processNext());
    }
  }

  /**
   * Resend / Retry an existing EmailLog by its MongoDB ObjectId
   */
  async resendEmailLog(logId) {
    const log = await EmailLog.findById(logId);
    if (!log) {
      throw new Error(`Email log with ID ${logId} not found`);
    }

    // Increment retry count in database immediately
    log.retryCount = (log.retryCount || 0) + 1;
    log.attempts = (log.attempts || 1) + 1;
    log.lastAttemptAt = new Date();
    await log.save();

    // Re-queue the email
    const job = await this.add(`resend_${log.template}`, {
      to: log.recipient,
      template: log.template,
      data: log.metadata || {},
      metadata: { ...log.metadata, resendOf: logId },
      existingLogId: log._id,
    });

    return {
      success: true,
      message: `Email re-queued for delivery to ${log.recipient}`,
      jobId: job.id,
      retryCount: log.retryCount,
    };
  }

  /**
   * Get Queue Real-Time Metrics
   */
  getMetrics() {
    const waiting = this.queue.filter((j) => j.status === 'waiting').length;
    const active = this.queue.filter((j) => j.status === 'active').length;
    const failed = this.queue.filter((j) => j.status === 'failed').length;

    return {
      status: 'healthy',
      driver: 'In-Memory Async Worker + MongoDB Atlas Audit Queue (BullMQ Semantics)',
      concurrency: this.concurrency,
      activeWorkers: this.activeWorkers,
      waitingJobs: waiting,
      activeJobs: active,
      failedJobs: failed,
      stats: this.stats,
    };
  }
}

// Global Singleton Instance
const emailQueue = new EmailQueue(3, 3);

module.exports = emailQueue;
