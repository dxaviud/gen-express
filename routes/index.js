const express = require("express");
const auth = require("../controllers/auth");

const router = express.Router();

/* GET home page. */
router.get("/", (_, res) => {
  res.redirect("/catalog");
});
router.get("/register", auth.getRegister);
router.post("/register", auth.register);
router.get("/login", auth.getLogin);
router.post("/login", auth.login);
router.get("/logout", auth.logout);

module.exports = router;
