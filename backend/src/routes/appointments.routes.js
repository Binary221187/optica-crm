const express = require('express');
const router = express.Router();
const { Appointment, Customer } = require('../models');
const authMiddleware = require('../middleware/auth.middleware');

// Crear cita (vendedor o admin)
router.post('/', authMiddleware.authenticateToken, authMiddleware.isVendedor, async (req, res) => {
  try {
    const { customer_id, appointment_date, appointment_time, service_type, notes } = req.body;

    // Verificar que el cliente existe
    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const appointment = await Appointment.create({
      customer_id,
      appointment_date,
      appointment_time,
      service_type,
      notes,
      status: 'programada',
      created_by: req.user.id,
    });

    res.status(201).json({
      message: 'Cita creada exitosamente',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las citas
router.get('/', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: ['customer'],
      order: [['appointment_date', 'ASC']],
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener cita por ID
router.get('/:id', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: ['customer'],
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cita
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.isVendedor, async (req, res) => {
  try {
    const { appointment_date, appointment_time, service_type, notes, status } = req.body;
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    await appointment.update({
      appointment_date,
      appointment_time,
      service_type,
      notes,
      status,
    });

    res.json({
      message: 'Cita actualizada',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cambiar estado de cita
router.patch('/:id/status', authMiddleware.authenticateToken, authMiddleware.isVendedor, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['programada', 'completada', 'cancelada', 'no_asistio'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    await appointment.update({ status });

    res.json({
      message: 'Estado de cita actualizado',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar cita
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    await appointment.destroy();

    res.json({ message: 'Cita eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
