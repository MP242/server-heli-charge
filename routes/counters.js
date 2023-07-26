var express = require("express");
var router = express.Router();
const counterCtrl = require("../controllers/counterCtrl");

/* GET all counters */
router.get("/", counterCtrl.getAllCounters);

/* GET counters by userID */
router.get("/user/:userID", counterCtrl.getCountersByUserId);

/* GET one counter */
router.get("/:id", counterCtrl.getOneCounter);

/* CREATE one counter */
router.post("/", counterCtrl.createCounter);

/* UPDATE one counter */
router.put("/:id", counterCtrl.updateCounter);

/* DELETE one counter */
router.delete("/:id", counterCtrl.deleteCounter);

module.exports = router;
