const SmileyService = require('./smiley.service')
const logger = require('../../services/logger.service')






async function getSmiley(req, res) {
    try {
        const filterBy = {
            txt: req.query?.txt
        }
        const smilies = await SmileyService.query()
       // console.log('smilies return from the server before sendint to front',smilies)
        res.send(smilies)
    } catch (err) {
        logger.error('Failed to get smilies', err)
        res.status(500).send({ err: 'Failed to get smilies' })
    }
}



module.exports = {
    getSmiley
}