const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const { createInvoicePdfStream } = require('../utils/pdfInvoiceGenerator');

class InvoiceService {
  /**
   * Generate and persist an invoice record for a payment
   */
  async createInvoiceForPayment(paymentData) {
    try {
      const year = new Date().getFullYear();
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const invoiceNumber = `INV-${year}-${paymentData.paymentId ? paymentData.paymentId.slice(-6).toUpperCase() : randomSuffix}`;

      const totalPaid = Number(paymentData.amount) || 12999;
      const baseSubtotal = Math.round(totalPaid / 1.18);
      const gstAmount = totalPaid - baseSubtotal;

      const invoice = await Invoice.findOneAndUpdate(
        { paymentId: paymentData.paymentId },
        {
          $set: {
            invoiceNumber,
            paymentId: paymentData.paymentId,
            orderId: paymentData.orderId || '',
            user: paymentData.userId || paymentData.studentId || null,
            customerName: paymentData.userName || 'Student Engineer',
            customerEmail: (paymentData.userEmail || 'student@krtech.edu').toLowerCase().trim(),
            customerPhone: paymentData.userPhone || '+91 98765 43210',
            billingAddress: {
              line1: 'Unit No. 615, Artha Mart, Tech Zone IV',
              city: 'Greater Noida West',
              state: 'Uttar Pradesh',
              pincode: '201318',
              country: 'India',
            },
            items: [
              {
                courseId: String(paymentData.courseId || 'course-enrolled'),
                courseTitle: String(paymentData.courseTitle || paymentData.courseName || 'KR Global Learning Mentorship Track'),
                unitPrice: baseSubtotal,
                quantity: 1,
                taxRate: 18,
                taxAmount: gstAmount,
                total: totalPaid,
              },
            ],
            subtotal: baseSubtotal,
            discount: Number(paymentData.discount) || 0,
            taxTotal: gstAmount,
            totalAmount: totalPaid,
            currency: paymentData.currency || 'INR',
            status: 'Paid',
            issueDate: new Date(),
            paymentMethod: paymentData.paymentMethod || paymentData.method || 'Razorpay UPI/Card/NetBanking',
            pdfDownloadUrl: `/api/invoices/download/${paymentData.paymentId}`,
            verificationUrl: `https://krtech.in/verify-invoice?id=${paymentData.paymentId}`,
          },
        },
        { upsert: true, new: true }
      );

      return invoice;
    } catch (error) {
      console.error('Invoice creation error:', error);
      throw error;
    }
  }

  /**
   * Get invoice stream by payment ID or invoice number
   */
  async getInvoicePdfStream(idOrPaymentId) {
    let invoice = await Invoice.findOne({
      $or: [
        { paymentId: idOrPaymentId },
        { invoiceNumber: idOrPaymentId },
        { orderId: idOrPaymentId },
      ],
    });

    let payment = await Payment.findOne({
      $or: [
        { paymentId: idOrPaymentId },
        { orderId: idOrPaymentId },
      ],
    });

    const paymentPayload = {
      paymentId: payment?.paymentId || invoice?.paymentId || idOrPaymentId,
      orderId: payment?.orderId || invoice?.orderId || 'order_ref_2026',
      userName: payment?.userName || invoice?.customerName || 'KR Global Learning Student',
      userEmail: payment?.userEmail || invoice?.customerEmail || 'student@krtech.in',
      userPhone: payment?.metadata?.phone || invoice?.customerPhone || '+91 98765 43210',
      courseTitle: payment?.courseTitle || invoice?.items?.[0]?.courseTitle || '1:1 Live Engineering Track',
      amount: payment?.amount || invoice?.totalAmount || 12999,
      createdAt: payment?.createdAt || invoice?.createdAt || new Date(),
    };

    return await createInvoicePdfStream(paymentPayload);
  }
}

module.exports = new InvoiceService();
