const jwt = require('jsonwebtoken');

// Middleware para verificar token JWT
exports.authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware para verificar rol específico
exports.authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Acceso denegado. Rol requerido: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

// Middleware para verificar que el usuario sea admin
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Solo administradores pueden acceder' });
  }

  next();
};

// Middleware para verificar que el usuario sea vendedor o admin
exports.isVendedor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  if (!['admin', 'vendedor'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  next();
};

// Middleware para verificar que el usuario sea técnico óptico o admin
exports.isTecnico = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  if (!['admin', 'tecnólogo_médico'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  next();
};

// Middleware para verificar que el usuario sea montajista o admin
exports.isMontajista = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  if (!['admin', 'montajista'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  next();
};

// Middleware para verificar propiedad de recurso
exports.verifyOwnership = async (Model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await Model.findByPk(resourceId);

      if (!resource) {
        return res.status(404).json({ error: 'Recurso no encontrado' });
      }

      // Admin tiene acceso a todo
      if (req.user.role === 'admin') {
        req.resource = resource;
        return next();
      }

      // Verificar si el usuario es propietario
      if (resource.user_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para acceder a este recurso' });
      }

      req.resource = resource;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

// Middleware para manejo de errores de autenticación
exports.errorHandler = (err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') {
    return res.status(403).json({ error: 'Token inválido' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expirado' });
  }

  next(err);
};
