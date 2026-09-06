const express = require('express');
const router = express.Router();
const { Customer } = require('../models');
const authMiddleware = require('../middleware/auth.middleware');

// Crear cliente (vendedor o admin)
router.post('/', authMiddleware.authenticateToken, authMiddleware.isVendedor, async (req, res) => {
  try {
    const { name, email, phone, address, city, country, date_of_birth } = req.body;

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
      city,
      country,
      date_of_birth,
      created_by: req.user.id,
    });

    res.status(201).json({
      message: 'Cliente creado exitosamente',
      customer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los clientes
router.get('/', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const customers = await Customer.findAll({
      order: [['created_at', 'DESC']],
    });

    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener cliente por ID
router.get('/:id', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cliente (vendedor o admin)
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.isVendedor, async (req, res) => {
  try {
    const { name, email, phone, address, city, country, date_of_birth } = req.body;
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    await customer.update({
      name,
      email,
      phone,
      address,
      city,
      country,
      date_of_birth,
    });

    res.json({
      message: 'Cliente actualizado',
      customer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar cliente (solo admin)
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    await customer.destroy();

    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
