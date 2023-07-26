
const dbService = require('../../services/db.service')
// const logger = require('../../services/logger.service')
// const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}


//************ Ok *****************************/
async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('story')
        // var stories = await collection.find(criteria).toArray()
        var stories = await collection.find({}).toArray()
       // console.log(' after filter the collections returned from the DB',stories)
        return stories
    } catch (err) {
        logger.error('cannot find story', err)
        throw err
    }
}
/**********************  ***************************/
async function getById(storyId) {
    try {
      //  console.log(' the id : ', storyId)
        const collection = await dbService.getCollection('story')
        const story = await collection.findOne({ '_id': ObjectId(storyId) })
       // delete story.password

        // story.givenReviews = await reviewService.query({ bystoryId: ObjectId(story._id) })
        // story.givenReviews = story.givenReviews.map(review => {
        //     delete review.byUser
        //     return review
        // })

        return story
    } catch (err) {
        logger.error(`while finding user ${storyId}`, err)
        throw err
    }
}

/***********************  ****************** */
async function remove(id) {
    try {
        const collection = await dbService.getCollection('story')
       // console.log('collection to remove',collection)
        await collection.deleteOne({ '_id': ObjectId(id) })
      //  console.log(' story removed :',id)
    } catch (err) {
        logger.error(`cannot remove story ${id}`, err)
        throw err
    }
}
/******************************** **********************************/
async function update(oldStory) {
    try {
        const oldStoryNewObj = JSON.parse(JSON.stringify(oldStory))
        oldStoryNewObj._id  = ObjectId(oldStory._id)
    //     console.log('story from front',oldStoryNewObj)
        //  console.log('story from the front',oldStory) 
        const collection = await dbService.getCollection('story')
       // console.log('collection from the DB',collection) 
        await collection.updateOne({ '_id': oldStoryNewObj._id }, { $set: oldStoryNewObj })
        return oldStoryNewObj;
    } catch (err) {
        logger.error(`cannot update story ${oldStory._id}`, err)
        throw err
    }
}
/*********************************  ****************************** */
async function add(newStory) {
    try {
        const newStoryNewObj = JSON.parse(JSON.stringify(newStory))
        delete newStoryNewObj._id 
        const collection = await dbService.getCollection('story')
        await collection.insertOne(newStoryNewObj)
        return newStoryNewObj
    } catch (err) {
        logger.error('cannot insert story', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.balance = { $gte: filterBy.minBalance }
    }
    return criteria
}


