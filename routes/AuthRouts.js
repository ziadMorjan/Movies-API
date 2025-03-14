const express = require("express");
const AuthController = require("./../controllers/AuthController");

let router = express.Router();

router.route("/signup")
    .post(AuthController.signup);

router.route("/login")
    .post(AuthController.login);

module.exports = router;