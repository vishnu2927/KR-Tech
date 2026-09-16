const express = require('express');
const router = express.Router();
const {
  getCertificates,
  verifyCertificate,
  createCertificate,
} = require('../controllers/certificateController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getCertificates);
router.get('/verify/:credentialId', verifyCertificate);
router.get('/:credentialId', verifyCertificate);
router.post('/', protect, admin, createCertificate);

module.exports = router;
