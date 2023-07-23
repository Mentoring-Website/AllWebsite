const express = require("express");
const Replie = require("../Controllers/replieControler");

const auth = require("../middleware/auth");
const router = express.Router();
router.post("/replie/:mentorApplicationId", Replie.addReplie);
router.get("/replie/:mentorApplicationId", Replie.getReplie);
module.exports = router;
