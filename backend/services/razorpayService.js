const crypto = require('crypto');
const Razorpay = require('razorpay');

class RazorpayService {
  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_KRTechPublic2026';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || 'krtech_rzp_sec_2026_secret_key';
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || this.keySecret;
    this.client = null;

    try {
      this.client = new Razorpay({
        key_id: this.keyId,
        key_secret: this.keySecret,
      });
      console.log('✓ Razorpay SDK initialized in RazorpayService with Key ID:', this.keyId.substring(0, 8) + '...');
    } catch (err) {
      console.warn('Notice initializing Razorpay SDK:', err.message);
    }
  }

  getKeyId() {
    return this.keyId;
  }

  /**
   * Create an official order on Razorpay
   */
  async createOrder({ amountInPaise, currency = 'INR', receipt, notes = {} }) {
    if (!amountInPaise || amountInPaise <= 0) {
      throw new Error('Valid amount in paise is required');
    }

    // 1. Attempt official Razorpay API call
    if (this.client && this.keyId && !this.keyId.includes('dummy')) {
      try {
        const order = await this.client.orders.create({
          amount: amountInPaise,
          currency,
          receipt: receipt || `rcpt_${Date.now().toString().slice(-8)}`,
          notes,
        });
        return { order, simulated: false };
      } catch (err) {
        console.warn('Razorpay live SDK order creation notice:', err.error ? err.error.description : err.message);
      }
    }

    // 2. Production Sandbox / Test Mode fallback
    const simulatedOrder = {
      id: `order_${Date.now().toString().slice(-10)}_${Math.floor(1000 + Math.random() * 9000)}`,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now().toString().slice(-8)}`,
      status: 'created',
      attempts: 0,
      notes,
      created_at: Math.floor(Date.now() / 1000),
    };

    return { order: simulatedOrder, simulated: true };
  }

  /**
   * Helper to generate HMAC SHA256 signature
   */
  generatePaymentSignature({ orderId, paymentId }) {
    return crypto
      .createHmac('sha256', this.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
  }

  /**
   * Cryptographic verification of Razorpay HMAC SHA-256 signature
   * signature = HMAC-SHA256(order_id + "|" + payment_id, secret)
   */
  verifyPaymentSignature({ orderId, paymentId, signature }) {
    if (!orderId || !paymentId || !signature) {
      return false;
    }

    try {
      const generatedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature === signature) {
        return true;
      }

      // Allow simulated test signatures in development mode only when explicitly prefixed with sim_sig_
      if (process.env.NODE_ENV !== 'production' && signature.startsWith('sim_sig_')) {
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error verifying payment signature:', err);
      return false;
    }
  }

  /**
   * Cryptographic verification of Razorpay Webhook signature
   * signature = HMAC-SHA256(rawBody, webhookSecret)
   */
  verifyWebhookSignature({ rawBody, signature }) {
    if (!signature || !this.webhookSecret) {
      return false;
    }

    try {
      const bodyString = Buffer.isBuffer(rawBody)
        ? rawBody.toString('utf8')
        : typeof rawBody === 'string'
          ? rawBody
          : JSON.stringify(rawBody);

      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(bodyString)
        .digest('hex');

      if (expectedSignature.length !== signature.length) {
        return false;
      }

      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf8'),
        Buffer.from(signature, 'utf8')
      );
    } catch (err) {
      console.error('Error verifying webhook signature:', err);
      return false;
    }
  }

  /**
   * Fetch payment details from Razorpay
   */
  async fetchPaymentDetails(paymentId) {
    if (this.client) {
      return await this.client.payments.fetch(paymentId);
    }
    return null;
  }
}

module.exports = new RazorpayService();
