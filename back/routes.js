const express = require("express");
const router = express.Router();
const userController = require("./app/users/controller");

router.post("/user/register", userController.userRegister);
router.post("/user/login", userController.userLogin);
router.get("/user", userController.getUser);

module.exports = router;
