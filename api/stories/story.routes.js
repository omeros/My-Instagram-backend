const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {getStories ,getStory ,addStory ,updateStory ,deleteStory } = require('./story.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/',  getStories)
router.get('/:id', getStory)
router.post('/',   addStory)
router.put('/:id',  updateStory)
router.delete('/:id',  deleteStory)

module.exports = router