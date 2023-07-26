var express = require("express");
var router = express.Router();
const userCtrl = require("../controllers/userCtrl");
const { check, validationResult } = require("express-validator");
const { generateToken, verifyToken } = require("../auth/jwt");
// const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get("/", userCtrl.allUsers);

/* CREATE one user */
router.post("/", userCtrl.createUser);

/* READ one user */
router.get("/:id", userCtrl.getOneUser);

/* UPDATE one user */
router.put("/:id", userCtrl.updateUser);

/* DELETE one user */
router.delete("/:id", userCtrl.deleteUser);

/* SIGNUP */
router.post("/signup", userCtrl.createUser);

/* LOGIN */
router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  userCtrl.login
);

/* LOGOUT */
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

/* Protected route */
router.get("/protected/welcome", (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = verifyToken(token);
    console.log(decoded);
  }

  if (decoded && decoded.id) {
    res.status(200).send(`Welcome, ${decoded.name}!`);
  } else {
    const { error, status = 401 } = decoded || {
      error: "Token not provided",
      status: 401,
    };
    res.status(status).json({ error });
  }
});

module.exports = router;
