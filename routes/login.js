var express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
var router = express.Router();

// Middleware pour vérifier le JWT
function verifyJWT(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).send('Unauthorized');
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      console.error(err);
      return res.status(403).send('Forbidden');
    }
  }
  
// Route de login
router.post(
    '/login',
    [
        check('email').isEmail(),
        check('password').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        // Vérifier que l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }
        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid email or password');
        }
        // Générer un token et le renvoyer
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.send({ token });
    }
);
  
// Route protégée par authentification
router.get('/protected', verifyJWT, (req, res) => {
    res.send(`Welcome ${req.user.email}!`);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json( { title: 'Express' });
});

router.get('/yo', function(req, res, next) {
  res.render('index', { title: 'yooooooo' })
});

module.exports = router;
