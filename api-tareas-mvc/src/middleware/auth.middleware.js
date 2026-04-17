const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../controllers/auth.controller');

const verificarJWT = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No autenticado' });
    }

    const payload = jwt.verify(token, JWT_SECRET);

    req.usuario = {
      email: payload.email,
      nombre: payload.nombre
    };

    req.csrfTokenJWT = payload.csrfToken;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
      error: error.message
    });
  }
};

const verificarCSRF = (req, res, next) => {
  try {
    const csrfHeader = req.headers['x-csrf-token'];

    if (!csrfHeader) {
      return res.status(403).json({ success: false, message: 'CSRF requerido' });
    }

    if (csrfHeader !== req.csrfTokenJWT) {
      return res.status(403).json({ success: false, message: 'CSRF inválido' });
    }

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Error CSRF',
      error: error.message
    });
  }
};

module.exports = {
  verificarJWT,
  verificarCSRF
};