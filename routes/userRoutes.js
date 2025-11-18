const express = require("express");
const router = express.Router();

const createUser = require("../controllers/user/createUser");
const getUsers = require("../controllers/user/getUser");
const getSingleUser = require("../controllers/user/getSingleUser");
const updateUser = require("../controllers/user/updateUser");
const deleteUser = require("../controllers/user/deleteUser");

router.get("/", getUsers);
router.get("/:id", getSingleUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
