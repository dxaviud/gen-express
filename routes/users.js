const express = require("express");

const router = express.Router();

/* GET users listing. */
router.get("/", require("../controllers/user").listUsers);

module.exports = router;
