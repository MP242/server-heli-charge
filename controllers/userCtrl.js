const User = require("../models/user.model");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { generateToken, verifyToken } = require("../auth/jwt");

exports.allUsers = async function (req, res, next) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);    
    res.status(500).json({ message: "Error retrieving users from database" });
  }
};

exports.createUser = async function (req, res, next) {
  try {
    const { userName, surname, name, email, password } = req.body;
    if (!userName || !name || !surname || !email || !password) {      
      res.status(400).json({ message: "Tous les champs sont requis" });
      return;
    }

    if (!emailRegex.test(req.body.email)) {      
      res.status(400).json({ message: "Adresse e-mail invalide" });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = new User({
      userName: req.body.userName,
      surname: req.body.surname,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      admin: req.body.admin || false,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);    
    res.status(400).json({ message: "Error inserting user into database" });
  }
};

exports.getOneUser = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error retrieving user from database" });
  }
};

exports.updateUser = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id ${req.params.id} not found` });
    }

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, saltRounds);
    }
    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.userName) {
      user.userName = req.body.userName;
    }
    if (req.body.surname) {
      user.surname = req.body.surname;
    }
    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.admin !== undefined) {
      user.admin = req.body.admin;
    }

    user.updated_at = new Date();
    const updatedUser = await user.save();
    res
      .status(200)
      .json({ message: `User with id ${updatedUser._id} updated` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
};

exports.deleteUser = async function (req, res, next) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {      
      return res.status(404).json({ message: "User not found" });
    }
    console.log(`Deleted user with id ${req.params.id}`);
    res.status(200).json({ message: `User with id ${req.params.id} deleted` });
  } catch (err) {
    console.error(err);    
    res.status(500).json({ message: "Error deleting user from database" });
  }
};

exports.login = async function (req, res, next) {  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  // Vérifier que l'utilisateur existe
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "This mail is not registered!" });
  }
  // Vérifier le mot de passe
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: "Invalid password!" });
  }
  // Générer un token et le renvoyer
  // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  const token = generateToken(user);
  res
    .status(200)
    .json({
      token: token,
      userName: user.userName,
      name: user.name,
      surname: user.surname,
      userId: user._id,
      admin: user.admin,
    });
};
