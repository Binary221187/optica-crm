const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rutas públicas
router.post('/login', authController.login);

// Rutas protegidas - Usuario autenticado
router.get('/profile', authMiddleware.authenticateToken, authController.getProfile);
router.post('/change-password', authMiddleware.authenticateToken, authController.changePassword);

// Rutas protegidas - Solo Admin
router.post('/users', authMiddleware.authenticateToken, authMiddleware.isAdmin, authController.createUser);
router.get('/users', authMiddleware.authenticateToken, authMiddleware.isAdmin, authController.listUsers);
router.put('/users/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, authController.updateUser);
router.patch('/users/:id/deactivate', authMiddleware.authenticateToken, authMiddleware.isAdmin, authController.deactivateUser);
router.post('/users/:id/reset-password', authMiddleware.authenticateToken, authMiddleware.isAdmin, authController.resetPassword);

module.exports = router;
