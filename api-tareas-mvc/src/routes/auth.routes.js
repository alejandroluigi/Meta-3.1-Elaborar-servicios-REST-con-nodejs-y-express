/**
 * Rutas de autenticación
 */

const express = require('express');
const authController = require('../controllers/auth.controller');
const { verificarJWT} = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/verify
router.get('/verify', verificarJWT, authController.verify);

const { verificarCSRF } = require('../middleware/auth.middleware');

// POST /api/auth/logout
router.post('/logout', verificarJWT, verificarCSRF, authController.logout);

module.exports = router;