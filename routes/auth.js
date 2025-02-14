const express = require("express");
const router = express.Router();

const { login, register, getAllUser } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/", getAllUser);

module.exports = router;
