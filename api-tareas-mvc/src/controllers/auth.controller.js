const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = 'mi_jwt_super_secreto_12345';
const API_KEY = 'mi_api_key_secreta_12345';

const usuariosPermitidos = [
  { email: 'admin@uabc.edu.mx', nombre: 'Administrador' },
  { email: 'alumno@uabc.edu.mx', nombre: 'Alumno' },
  { email: 'test@test.com', nombre: 'Usuario de prueba' }
];

const responderAuth = (req, res, options = {}) => {
  const { status = 200, success = true, message = '', data, error, csrfToken } = options;

  const respuesta = { success };
  if (message) respuesta.message = message;
  if (data !== undefined) respuesta.data = data;
  if (csrfToken) respuesta.csrfToken = csrfToken;
  if (error) respuesta.error = error;

  return res.status(status).json(respuesta);
};

const login = (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const { email } = req.body;

    if (!apiKey || apiKey !== API_KEY) {
      return responderAuth(req, res, { status: 401, success: false, message: 'API Key inválida' });
    }

    if (!email) {
      return responderAuth(req, res, { status: 400, success: false, message: 'Email requerido' });
    }

    const usuario = usuariosPermitidos.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!usuario) {
      return responderAuth(req, res, { status: 401, success: false, message: 'Usuario no autorizado' });
    }

    const csrfToken = crypto.randomBytes(32).toString('hex');

    const payload = {
      email: usuario.email,
      nombre: usuario.nombre,
      csrfToken
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true en producción
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });

    return responderAuth(req, res, {
      message: 'Login exitoso',
      data: { usuario },
      csrfToken
    });

  } catch (error) {
    return responderAuth(req, res, {
      status: 500,
      success: false,
      message: 'Error en login',
      error: error.message
    });
  }
};

const verify = (req, res) => {
  return responderAuth(req, res, {
    message: 'Sesión válida',
    data: { usuario: req.usuario }
  });
};

const logout = (req, res) => {
  res.clearCookie('token');

  return responderAuth(req, res, {
    message: 'Logout exitoso'
  });
};

module.exports = {
  login,
  verify,
  logout,
  JWT_SECRET
};