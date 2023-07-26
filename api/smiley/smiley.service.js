
const dbService = require('../../services/db.service')
// const logger = require('../../services/logger.service')
// const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,

}


//************ Ok *****************************/
async function query() {
   // const criteria = _buildCriteria()
    try {
        const collection = await dbService.getCollection('smiley')
        // var stories = await collection.find(criteria).toArray()
        var smiley = await collection.find({}).toArray()
     //   console.log(' after filter the collections returned from the DB',smiley)
        return smiley
    } catch (err) {
        logger.error('cannot find smiley', err)
        throw err
    }
}


