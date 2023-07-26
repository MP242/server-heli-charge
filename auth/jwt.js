const jwt = require('jsonwebtoken');

// Fonction pour générer un token
function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    name: user.name,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  return token;
}

// Fonction pour vérifier un token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// function verifyJWT(req, res, next) {
//   const token = req.headers['authorization'];
//   if (!token) {
//     return res.status(401).send('Unauthorized');
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error(err);
//     return res.status(403).send('Forbidden');
//   }
// }

module.exports = {
  generateToken,
  verifyToken
};
