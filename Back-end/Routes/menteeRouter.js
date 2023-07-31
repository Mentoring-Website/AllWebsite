// const express = require('express')
// const router = express.Router()
// const upload = require('../middleware/upload')
// const MenteeController = require('../Controllers/MenteeProfileController')
// const auth = require("../middleware/auth")

// router.use(auth)

// router.post('/menteeProfile', upload.single('avatar'), MenteeController.addNewMentee)
// router.get('/menteeProfile', MenteeController.getAllMentee)
// router.get('/menteeProfile/:id', MenteeController.getMentee)
// router.get('/menteeProfile/user/:id', MenteeController.getMenteeByUser)
// router.patch('/menteeProfile/:id', upload.single('avatar'), MenteeController.updateMentee)
// router.delete('/menteeProfile/:id', MenteeController.removeMentee)


// module.exports = router

const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const MenteeController = require('../Controllers/MenteeProfileController')
const auth = require("../middleware/auth")

router.use(auth)

router.post('/menteeProfile', MenteeController.addNewMentee)
router.get('/menteeProfile', MenteeController.getAllMentee)
router.get('/menteeProfile/:id', MenteeController.getMentee)
router.get('/menteeProfile/user/:id', MenteeController.getMenteeByUser)
router.patch('/menteeProfile/:id', upload.single('avatar'), MenteeController.updateMentee)
router.delete('/menteeProfile/:id', MenteeController.removeMentee)


module.exports = router