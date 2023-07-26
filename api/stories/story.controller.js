const StoryService = require('./story.service')
const logger = require('../../services/logger.service')






async function getStories(req, res) {
    try {
        const filterBy = {
            txt: req.query?.txt
        }
        const stories = await StoryService.query(filterBy)
   //     console.log('stories return from the server before sendint to front',stories)
        res.send(stories)
    } catch (err) {
        logger.error('Failed to get storie', err)
        res.status(500).send({ err: 'Failed to get stories' })
    }
}

async function getStory(req, res) {
    try {
        const story = await StoryService.getById(req.params.id)
        res.send(story)
    } catch (err) {
        logger.error('Failed to get story', err)
        res.status(500).send({ err: 'Failed to get story' })
    }
}

///**************************  ********************** */
async function addStory(req, res) {
    try {
 //       console.log(' add new story')//, req.body)
        var story = req.body
        story = await StoryService.add(story)
        res.send(story)
    } catch (err) {
        logger.error('Failed to add story', err)
        res.status(500).send({ err: 'Failed to add story' })
    }
}
async function deleteStory(req, res) {
    try {
        await StoryService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete story', err)
        res.status(500).send({ err: 'Failed to delete story' })
    }
}

async function updateStory(req, res) {
    try {
        const story = req.body
        const savedstory = await StoryService.update(story)
       // console.log('  story returned from DBbbbbbbbbbbbbbbbbbbb ', savedstory)
        res.send(savedstory)
    } catch (err) {
        logger.error('Failed to update story', err)
        res.status(500).send({ err: 'Failed to update story' })
    }
}

module.exports = {
    getStory,
    getStories,
    addStory,
    deleteStory,
    updateStory
}