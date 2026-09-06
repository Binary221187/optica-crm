const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const authMiddleware = require('../middleware/auth.middleware');

// Crear producto (solo admin)
router.post('/', authMiddleware.authenticateToken, authMiddleware.isAdmin, async (req, res) => {
  try {
    const { name, sku, category, price, cost, stock, description } = req.body;

    const product = await Product.create({
      name,
      sku,
      category,
      price,
      cost,
      stock,
      description,
    });

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los productos
router.get('/', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['name', 'ASC']],
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener producto por ID
router.get('/:id', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar producto (solo admin)
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, async (req, res) => {
  try {
    const { name, sku, category, price, cost, stock, description } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await product.update({
      name,
      sku,
      category,
      price,
      cost,
      stock,
      description,
    });

    res.json({
      message: 'Producto actualizado',
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar stock
router.patch('/:id/stock', authMiddleware.authenticateToken, authMiddleware.isVendedor, async (req, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' o 'subtract'
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    let newStock = product.stock;
    if (operation === 'add') {
      newStock += quantity;
    } else if (operation === 'subtract') {
      newStock -= quantity;
      if (newStock < 0) {
        return res.status(400).json({ error: 'Stock insuficiente' });
      }
    } else {
      return res.status(400).json({ error: 'Operación inválida' });
    }

    await product.update({ stock: newStock });

    res.json({
      message: 'Stock actualizado',
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto (solo admin)
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await product.destroy();

    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
