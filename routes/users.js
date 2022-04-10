const express = require("express");

const router = express.Router();

const user = require("../controllers/user");
router.get("/", user.list);
router.get("/:username", user.get);

module.exports = router;
