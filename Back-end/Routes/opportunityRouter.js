const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const auth = require('../middleware/auth');
const { isMentor } = require('../middleware/reqAndOpp')
const opportunityController = require('../Controllers/opportunityController');

router.use(auth)

router.post('/opp', isMentor, asyncHandler(opportunityController.createOpportunity));
router.get('/opp', asyncHandler(opportunityController.getAllOpportunities));
router.get('/opp/:id', isMentor, asyncHandler(opportunityController.getOpportunityById));
router.get("/opp/owner/:id", auth, asyncHandler(opportunityController.getOpportunityByUserId));
router.patch('/opp/:id', isMentor, asyncHandler(opportunityController.updateOpportunity));
router.delete('/opp/:id', isMentor, asyncHandler(opportunityController.deleteOpportunity));

module.exports = router;
