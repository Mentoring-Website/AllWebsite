const router = require("express").Router();
const homeController = require("../Controllers/mentorRequestController");
const auth = require("../middleware/auth")
const { isMentee } = require("../middleware/reqAndOpp")
const asyncHandler = require('express-async-handler');

router.post("/request", auth, isMentee, asyncHandler(homeController.postRequests));
router.get("/request", auth, asyncHandler(homeController.getRequests));
router.get("/request/:id", auth, isMentee, asyncHandler(homeController.getRequestsByID));
router.get("/request/owner/:id", auth, asyncHandler(homeController.getRequestsByOwnerId));
router.patch("/request/:id", auth, isMentee, asyncHandler(homeController.patchRequets));
router.delete("/request/:id", auth, isMentee, asyncHandler(homeController.deleteRequests))

module.exports = router;
