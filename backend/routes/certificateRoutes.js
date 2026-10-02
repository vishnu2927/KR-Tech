const express = require('express');
const router = express.Router();
const {
  getCertificates,
  verifyCertificate,
  downloadCertificatePdf,
  generateCertificate,
  createCertificate,
  emailCertificate,
  whatsappCertificate,
} = require('../controllers/certificateController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getCertificates);
router.post('/generate', generateCertificate);
router.post('/send-email', emailCertificate);
router.post('/send-whatsapp', whatsappCertificate);
router.get('/verify/:credentialId', verifyCertificate);
router.get('/:credentialId/pdf', downloadCertificatePdf);
router.get('/download/:credentialId', downloadCertificatePdf);
router.get('/:credentialId', verifyCertificate);
router.post('/', protect, admin, createCertificate);

module.exports = router;
