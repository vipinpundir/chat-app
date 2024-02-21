const express = require("express")

const {sendMessage} = require("../controllers/message.controller.js");
const {getMessage} = require("../controllers/message.controller.js");
const protectRoute = require("../middleware/protectRoute.js");

const router = express.Router()

router.post("/:id", protectRoute, getMessage)
router.post("/send/:id", protectRoute, sendMessage)

module.exports = router;