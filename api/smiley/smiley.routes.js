const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {getSmiley} = require('./smiley.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/',  getSmiley)

module.exports = router