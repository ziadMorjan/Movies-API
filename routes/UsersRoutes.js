const express = require("express");
const UserController = require("./../controllers/UserController");
const { protect, allowTo } = require("../middlewares/AuthMiddleware");

let router = express.Router();

router.route("/changePassword")
    .patch(protect, UserController.changePassword);

router.route("/updateMe")
    .patch(protect, UserController.updateMe);

router.route("/deleteMe")
    .patch(protect, UserController.deleteMe);

router.route("/")
    .get(UserController.getAllUsers)
    .post(protect, allowTo("admin"), UserController.createUser);

router.route("/:id")
    .get(UserController.getUser)
    .patch(protect, allowTo("admin"), UserController.updateUser)
    .delete(protect, allowTo("admin"), UserController.deleteUser);

module.exports = router;