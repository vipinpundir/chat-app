const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const getUsersForSidebar = require("../controllers/users.controller")


const router = express.Router()

router.post("/", protectRoute , getUsersForSidebar)

module.exports = router;